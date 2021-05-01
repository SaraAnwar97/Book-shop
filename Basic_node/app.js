const express = require('express');
const app = express(); // initialize a new object where express.js will store and manager our app
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use('/add',(req,res,next)=>{
    console.log('In another middleware');
    res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add</button></form>'); // not calling next, so next middleware doesn't handle the request and to return only one response
    });

 app.post('/product',(req,res,next)=>{
     console.log(req.body);
     res.redirect('/');
 })   
 //app.get , filtering for get requests
 //app.post , filtering for post requests
 //app.use('/),filtering for path
// '/' is the path of the route , it means every route starts with /
app.use('/',(req,res,next)=>{
    res.send('<h1>Hello</h1>');
    });

app.listen(3000);