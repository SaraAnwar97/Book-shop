const Product = require('../models/product'); // importing Product class
const Order = require('../models/order');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const stripe = require('stripe')('sk_test_51J5xXrLK0ECg6dX4ItUvwFh8xnlsbJpUU4EdBnDz9HLrQJaoPq7niwbfJXmalVK5gBtfukk6NrzZaV6BCsmDQRFg00YkmuKvBa'); //secret key
const itemPerPage = 2;

exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
    Product.find().countDocuments().then(numProducts =>{
        totalItems = numProducts
        return Product.find() 
        .skip((page-1) * itemPerPage) // skips first two items
        .limit(itemPerPage) // limits amount of data fetched to 2
    })
    .then(products =>{
        res.render('shop/product-list',{
            prods: products,
            pageTitle: 'Products',
            path : '/product-list',
            currentPage: page,
            hasNextPage: itemPerPage * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page -1,
            lastPage: Math.ceil(totalItems/itemPerPage)
    });
})
    .catch(err =>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
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
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
})
}

exports.getIndex = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
    Product.find().countDocuments().then(numProducts =>{
        totalItems = numProducts
        return Product.find() 
        .skip((page-1) * itemPerPage) // skips first two items
        .limit(itemPerPage) // limits amount of data fetched to 2
    })
    .then(products =>{
        res.render('shop/index',{
            prods: products,
            pageTitle: 'All Shop',
            path : '/',
            currentPage: page,
            hasNextPage: itemPerPage * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page -1,
            lastPage: Math.ceil(totalItems/itemPerPage)
    });
})
    .catch(err =>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
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
                    
            });
        })
        .catch(err =>{
            const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
    }).catch(err =>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
  };

  exports.getOrder = (req,res,next) => {
      Order.find({'users.userId': req.user})
      .then(orders =>{
        res.render('shop/orders',{
            path : '/orders',
            pageTitle: 'Your orders',
            orders: orders,
            
      });
    })
    .catch(err => {
        const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
                email: req.user.email,
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
    .catch(err => {const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
    };

    exports.getCheckoutSuccess = (req,res,next) => {
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
                    email: req.user.email,
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
        .catch(err => {const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
        };
exports.postDeleteCart = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
    .deleteCart(prodId)
    .then(result=>{
        res.redirect('/cart');
    })
    .catch(err=>{const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);});
  };


exports.getCheckout = (req,res,next) => {
    let products;
    let total = 0;
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user =>{
           products = user.cart.items;
           total = 0;
           products.forEach(p=>{
           total += p.quantity * p.productId.price;
           });

           return stripe.checkout.sessions.create({
            //configuring session
            //accepts credit card
           payment_method_types: ['card'], 
           line_items : products.map(p =>{
               return {
                   name: p.productId.title,
                   description : p.productId.description,
                   amount : p.productId.price * 100,
                   currency: 'usd',
                   quantity: p.quantity
               };
           }),
           // http://localhost:3000
           success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
           cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
           });
    })
    .then(session =>{
        res.render('shop/checkout',{
            path: '/checkout',
            pageTitle: 'Checkout',
            products: products,
            totalSum : total,
            sessionId : session.id
    });
    })
    .catch(err =>{
        const error = new Error(err);
  error.httpStatusCode = 500;
  return next(error);
    });
    };

exports.getInvoice = (req,res,next) =>{
    const orderId = req.params.orderId;
    Order.findById(orderId)
    .then(order =>{
        if(! order){
            return next(new Error ('No order found'));
        }
        if(order.users.userId.toString() !== req.user._id.toString()){
            return next(new Error('Unauthorized'));
        }
        const invoiceName = 'invoice-' + orderId + '.pdf';
    const invoicePath = path.join('data', 'invoices',invoiceName);
    const pdfDoc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf'); //opens pdf in browser
    res.setHeader('Content-Disposition', 'inline; filename = "' + invoiceName + '"');
    pdfDoc.pipe(fs.createWriteStream(invoicePath)); //file saved in server
    pdfDoc.pipe(res);
    pdfDoc.fontSize(26).text('Invoice',{
        underline: true
    });
    pdfDoc.text('-------------------');
    let totalPrice = 0;
    order.products.forEach(prod =>{
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc.fontSize(14).text(prod.product.title + ' - '
           + prod.quantity + ' X '+ 
            '$' + prod.product.price
            );
    });
  pdfDoc.text('-------------------');
  pdfDoc.fontSize(20).text('Total price : $' + totalPrice);


    pdfDoc.end();
    // fs.readFile(invoicePath, (err,data)=>{
    //     if(err){
    //         return next(err);
    //     }
    //    res.setHeader('Content-Type', 'application/pdf'); //opens pdf in browser
    //    res.setHeader('Content-Disposition', 'attachment; filename = "' + invoiceName + '"'); // les you save pdf with correct name & extension
    //    res.setHeader('Content-Disposition', 'inline; filename = "' + invoiceName + '"');
    //    res.send(data);
    // });
    // const file = fs.createReadStream(invoicePath);
    //    res.setHeader('Content-Type', 'application/pdf'); //opens pdf in browser
    //    res.setHeader('Content-Disposition', 'inline; filename = "' + invoiceName + '"');
    //     file.pipe(res);
    }).catch(err=>{
        next(err);
    })
    
};