//const http = require('http');
const express = require('express');
const app = express(); // initialize a new object where express.js will store and manager our app
app.use((req,res,next)=>{
console.log('In the middleware');
next(); // allows req to continue to next middleware in line , else send response
}); // add new middleware fn , fn will be executed for every req
app.use((req,res,next)=>{
    console.log('In another middleware');
    res.send('<h1>Hello</h1>');
    });
//const server = http.createServer(app); // app is a valid requestHandler
//server.listen(3000);
app.listen(3000);