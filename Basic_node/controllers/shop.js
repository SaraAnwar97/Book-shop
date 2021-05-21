const Product = require('../models/product'); // importing Product class
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    Product.find()
    .then(products =>{
        console.log(products);
        res.render('shop/product-list',{prods: products,
            pageTitle: 'All Products',
            path : '/product-list',
            isAuthenticated: req.isLoggedIn
           
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
        path: '/products',
        isAuthenticated: req.isLoggedIn
    });
})
.catch(err =>{
    console.log(err);
})
}

exports.getIndex = (req, res, next) => {
    Product.find()
    .then(products =>{
        res.render('shop/product-list',{prods: products,
            pageTitle: 'All Products',
            path : '/product-list',
            isAuthenticated: req.isLoggedIn
           
    });
})
    .catch(err =>{
        console.log(err);
    });
  };

exports.getCart = (req,res,next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user =>{
               const products = user.cart.items;
                res.render('shop/cart',{
                    path: '/cart',
                    pageTitle: 'Your cart',
                    products: products,
                    isAuthenticated: req.isLoggedIn
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
        res.redirect('/cart');
    });
  };

  exports.getOrder = (req,res,next) => {
      Order.find({'users.userId': req.user._id})
      .then(orders =>{
        res.render('shop/orders',{
            path : '/orders',
            pageTitle: 'Your orders',
            orders: orders,
            isAuthenticated: req.isLoggedIn
      });
    })
    .catch(err => console.log(err));
    };

exports.postOrder = (req,res,next) => {
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user =>{
        console.log(user.cart.items);
           const products = user.cart.items.map(i =>{
               
               return {quantity:i.quantity , product:{ ...i.productId._doc }};
           });
           const order = new Order({
            users:{
                name: req.user.name,
                userId: req.user
            },
            products: products
        });
      return order.save();
    })
    .then(result => {
       return req.user.clearCart();
    })
    .then(()=>{
        res.redirect('/orders');
    })
    .catch(err => console.log(err));
    };

exports.postDeleteCart = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
    .deleteCart(prodId)
    .then(result=>{
        res.redirect('/cart');
    })
    .catch(err=>console.log(err));
  };


exports.getChekout = (req,res,next) => {
    res.render('shop/checkout',{
        path: '/checkout',
        pageTitle: 'Checkout cart',
        isAuthenticated: req.isLoggedIn
    });
    };