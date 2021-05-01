const express = require('express');
const router = express.Router();
// /admin/add => GET
router.get('/add-product',(req,res,next)=>{
    console.log('In another middleware');
    res.send('<form action="/admin/product" method="POST"><input type="text" name="title"><button type="submit">Add</button></form>'); // not calling next, so next middleware doesn't handle the request and to return only one response
    });
// /admin/product => POST
 router.post('/product',(req,res,next)=>{
     console.log(req.body);
     res.redirect('/');
 })   
module.exports = router;