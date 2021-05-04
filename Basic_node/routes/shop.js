const path = require('path');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();
const adminData = require('./admin');

router.get('/',(req,res,next)=>{
    //__dir name is a global variable available by node.js , which holds the absolute on os to this proj folder
    // '../' goes up one level from routes to views 
    console.log('shop.js',adminData.products);
    res.sendFile(path.join(rootDir,'views','shop.html'))
    });

module.exports = router;