const Product = require('../models/product'); // importing Product class
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(products =>{
        res.render('shop/product-list',{prods: products,
            pageTitle: 'All Products',
            path : '/product-list',
           
    });
})
    .catch(err =>{
        console.log(err);
    });
  };

exports.getProduct = (req,res,next)=>{
    //express offers a params object on our request
    const prodId = req.params.productId; // params.(name after :)

Product.findById(prodId)
.then(product => {
    res.render('shop/product-detail',{
        product : product,
        pageTitle : product.title,
        path: '/products'
    });
})
.catch(err =>{
    console.log(err);
})
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
    .then(products =>{
        res.render('shop/product-list',{prods: products,
            pageTitle: 'All Products',
            path : '/product-list',
           
    });
})
    .catch(err =>{
        console.log(err);
    });
  };

exports.getCart = (req,res,next) => {
    req.user
        .getCart()
        .then(products =>{
                res.render('shop/cart',{
                    path: '/cart',
                    pageTitle: 'Your cart',
                    products: products
            });
        })
        .catch(err =>{
            console.log(err);
        });
    }

    
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(product =>{
        return req.user.addToCart(product);
    }).then(result=>{
        console.log(result);
    });
  };

exports.getOrders = (req,res,next) => {
    res.render('shop/orders',{
        path: '/orders',
        pageTitle: 'Your orders'
    });
    };

exports.postDeleteCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
      Cart.deleteProduct(prodId, product.price);
      res.redirect('/cart');
    });
  };


exports.getChekout = (req,res,next) => {
    res.render('shop/checkout',{
        path: '/checkout',
        pageTitle: 'Checkout cart'
    });
    };