const Product = require('../models/product'); // importing Product class
const mongoose = require('mongoose');
const {validationResult} = require('express-validator/check');
exports.getAddProduct = (req,res,next)=>{
    if(!req.session.isLoggedIn){
        return res.redirect('/login');
    }
    res.render('admin/edit-product',{
    pageTitle:'Add product',
    path:'admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors : []
 });
};
// in post requests, you use req body
exports.postAddProduct = (req,res,next)=>{
    const title = req.body.title;
    const image = req.file;
    const description = req.body.description;
    const price = req.body.price;
    if(!image){
        return  res.status(422).render('admin/edit-product',{
            pageTitle:'Add product',
            path:'admin/add-product',
            editing: false,
            hasError: true,
            Oldproduct : {
                title: title,
                description: description,
                price: price
            },
            errorMessage: 'Attached file is not an image',
            validationErrors : []
         });
    }
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
        return  res.status(422).render('admin/edit-product',{
            pageTitle:'Add product',
            path:'admin/add-product',
            editing: false,
            hasError: true,
            Oldproduct : {
                title: title,
                description: description,
                price: price
            },
            errorMessage: errors.array()[0].msg,
            validationErrors : errors.array()
         });
    }
    const imageUrl = image.path;
    //storing user id as a reference to the user who's adding a prod
    const product = new Product(
        {   title:title,
            price:price,
            description:description,
            imageUrl: imageUrl,
            userId : req.user
        }
    );
    product.save()
    .then(result =>{
        console.log('product created');
        res.redirect('/admin/product-list');
    })
    .catch(err =>{
        // return  res.status(500).render('admin/edit-product',{
        //     pageTitle:'Add product',
        //     path:'admin/add-product',
        //     editing: false,
        //     hasError: true,
        //     Oldproduct : {
        //         title: title,
        //         imageUrl: imageUrl,
        //         description: description,
        //         price: price
        //     },
        //     errorMessage:'Database operation failed, please try again',
        //     validationErrors : []
        //});
       // res.redirect('/500');
      // const error = new Error('creating a product failed')
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req,res,next)=>{
    const editMode = req.query.edit;
    if(! editMode){
        return res.redirect('/');
    }
    const prodId = req.params.productId; //extracting productId from URL in routes
    Product.findById(prodId)
    .then(product =>{
        if(!product){
            return res.redirect('/');
        }
        res.render('admin/edit-product',{
            pageTitle:'edit product',
            path:'admin/edit-product',
            editing: editMode,
            product: product,
            hasError: false,
            errorMessage: null,
            validationErrors : []
         });
    })
    .catch(err =>{
       const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

};

exports.postEditProduct=(req,res,next)=>{
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const image = req.file;
    const updatedDescription = req.body.description;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return  res.status(422).render('admin/edit-product',{
              pageTitle:'Edit product',
              path:'admin/edit-product',
              editing: true,
              hasError: true,
              Oldproduct : {
                  title: updatedTitle,
                  description: updatedDescription,
                  price: updatedPrice,
                  _id : prodId
              },
              errorMessage: errors.array()[0].msg,
              validationErrors : errors.array()
           });
      }
   Product.findById(prodId).then(product => {
       if(product.userId.toString() !== req.user._id.toString()){
           return res.redirect('/')
       }
       //product is a mongoose object with all mongoose methods
       product.title = updatedTitle;
       product.price = updatedPrice;
       product.description = updatedDescription;
       if(image){
           product.imageUrl = image.path;
       }
       return product.save().then(result =>{
        console.log('product updated');
        res.redirect('/admin/product-list')
    });
   })
   
   .catch(err =>{
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
   });

};

exports.getProductList = (req,res,next) =>{
    
    Product.find({userId : req.user._id})
    .then(products => {
        res.render('admin/product-list',{
            prods: products,
            pageTitle: 'Admin Products',
            path : '/admin/product-list',
            
    })
})
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });

};

exports.postDeleteProduct=(req,res,next)=>{
    const prodId = req.body.productId;
    Product.deleteOne({_id :prodId, userId: req.user._id})
    .then(()=>{
        console.log('destroyed product')
        res.redirect('/admin/product-list');
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
   
};