const Product = require('../models/product'); // importing Product class


exports.getProducts = (req, res, next) => {
    Product.fetchAll((products)=>{
        res.render('shop/product-list',{prods: products,
            pageTitle: 'All Products',
            path : '/product-list',
           
    });
});
  };

exports.getIndex = (req,res,next) =>{
    Product.fetchAll((products)=>{
        res.render('shop/index',{prods: products,
            pageTitle: 'shop',
            path : '/',
    });
});
};

exports.getCart = (req,res,next) => {
res.render('shop/cart',{
    path: '/cart',
    pageTitle: 'Your cart'
});
};

exports.getOrders = (req,res,next) => {
    res.render('shop/orders',{
        path: '/orders',
        pageTitle: 'Your orders'
    });
    };

exports.getChekout = (req,res,next) => {
    res.render('shop/checkout',{
        path: '/checkout',
        pageTitle: 'Checkout cart'
    });
    };