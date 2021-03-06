    const path = require('path');
    const express = require('express');
    const shopController = require('../controllers/shop');
    const router = express.Router();
    const isAuth = require('../middleware/is-auth');
    
    router.get('/', shopController.getIndex);
    router.get('/products',shopController.getProducts);
  //   // // router.get('/products/delete'); //spicific routes before dynamic segment
  //   // //products/37474783(any random no)
  //   // //: indicates a variable (dynamic) segment to express
     router.get('/products/:productId',shopController.getProduct);
     router.get('/cart',isAuth, shopController.getCart);
     router.post('/cart',isAuth, shopController.postCart);
     router.post('/cart-delete-item', isAuth,shopController.postDeleteCart);
     router.get('/checkout',isAuth, shopController.getCheckout);
     router.get('/checkout/success', shopController.getCheckoutSuccess);
     router.get('/checkout/cancel',shopController.getCheckout);
     router.get('/orders',isAuth, shopController.getOrder);
  //   // router.get('/checkout', shopController.getChekout);
     router.get('/orders/:orderId', isAuth, shopController.getInvoice);
    
module.exports = router;
    