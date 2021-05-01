const express = require('express');
const bodyParser=require('body-parser');
const path = require('path');
const app = express(); // initialize a new object where express.js will store and manager our app

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({extended:false}));
//filtering paths
//only routes starting with '/admin' will go to adminRoutes file
app.use('/admin',adminRoutes);
app.use(shopRoutes);
//adding 404 error page , use: handles all http methods not only get requests
app.use((req,res,next)=>{
res.status(404).sendFile(path.join(__dirname,'views','404.html'));
});


app.listen(3000);