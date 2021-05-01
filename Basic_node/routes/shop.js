const path = require('path');
const express = require('express');
const router = express.Router();
router.get('/',(req,res,next)=>{
    //__dir name is a global variable available by node.js , which holds the absolute on os to this proj folder
    // '../' goes up one level from routes to views
    res.sendFile(path.join(__dirname,'../','views','shop.html'))
    });

module.exports = router;