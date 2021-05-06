    const path = require('path');
    
    const express = require('express');
    
    const rootDir = require('../util/path');
    const adminData = require('./admin');
    
    const router = express.Router();
    
    router.get('/', (req, res, next) => {
      const products = adminData.products;
      res.render('shop',{prods: products,
        pageTitle: 'shop',
        path : '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
        //layout:false (won't use default layout)
       });// second arg: pass data added to view
    });
    
module.exports = router;
    