const express = require('express');
const path = require('path');
const router = express.Router();
// /admin/add => GET
router.get('/add-product',(req,res,next)=>{
    console.log('In another middleware');
   res.sendFile(path.join(__dirname,'../','views','add-product.html'));
    });
// /admin/product => POST
 router.post('/product',(req,res,next)=>{
     console.log(req.body);
     res.redirect('/');
 })   
module.exports = router;