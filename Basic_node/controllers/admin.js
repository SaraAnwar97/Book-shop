const Product = require('../models/product'); // importing Product class
exports.getAddProduct = (req,res,next)=>{
    if(!req.session.isLoggedIn){
        return res.redirect('/login');
    }
    res.render('admin/edit-product',{
    pageTitle:'Add product',
    path:'admin/add-product',
    editing: false
 });
};
// in post requests, you use req body
exports.postAddProduct = (req,res,next)=>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    //storing user id as a reference to the user who's adding a prod
    const product = new Product(
        {
            title:title,
            price:price,
            description:description,
            imageUrl:imageUrl,
            userId : req.user
        }
    );
    product.save()
    .then(result =>{
        console.log('product created');
        res.redirect('/admin/product-list');
    })
    .catch(err =>{
        console.log(err);
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
            product : product,
         });
    })
    .catch(err =>{
        console.log(err);
    })

};

exports.postEditProduct=(req,res,next)=>{
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
   Product.findById(prodId).then(product => {
       //product is a mongoose object with all mongoose methods
       product.title = updatedTitle,
       product.price = updatedPrice
       product.description = updatedDescription,
       product.imageUrl = updatedImageUrl
       return product.save();
   })
   .then(result =>{
       console.log('product updated');
       res.redirect('/admin/product-list')
   })
   .catch(err =>{
       console.log(err);
   })

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
        console.log(err);
    });

};

exports.postDeleteProduct=(req,res,next)=>{
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
    .then(()=>{
        console.log('destroyed product')
        res.redirect('/admin/product-list');
    })
    .catch(err=>{
        console.log(err);
    })
   
};