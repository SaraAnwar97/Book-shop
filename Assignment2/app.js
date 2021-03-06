const express = require('express');
const app = express();
/*app.use((req,res,next)=>{
    console.log('hey');
next();
});
app.use((req,res,next)=>{
    console.log('hello');
res.send('<h1>Assignment2</h1>');
});*/
//most specific middleware first
app.use('/users',(req,res,next)=>{
    console.log('hello');
    res.send('<h1>Middleware handles /users</h1>');
});
//less specific middleware second
app.use('/',(req,res,next)=>{
    console.log('hey');
    res.send('<h1>Middleware handles /</h1>');
});

app.listen(3000);