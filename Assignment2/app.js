const express = require('express');
const app = express();
app.use((req,res,next)=>{
    console.log('hey');
next();
});
app.use((req,res,next)=>{
    console.log('hello');
res.send('<h1>Assignment2</h1>');
});
app.listen(3000);