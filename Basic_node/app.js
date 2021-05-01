const express = require('express');
const app = express(); // initialize a new object where express.js will store and manager our app
app.use('/',(req,res,next)=>{
    console.log('This always works');
    next();
    });
app.use('/add',(req,res,next)=>{
    console.log('In another middleware');
    res.send('<h1>Hey</h1>'); // not calling next, so next middleware doesn't handle the request and to return only one response
    });
// '/' is the path of the route , it means every route starts with /
app.use('/',(req,res,next)=>{
    console.log('In another middleware');
    res.send('<h1>Hello</h1>');
    });

app.listen(3000);