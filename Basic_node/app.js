const express = require('express');
const bodyParser=require('body-parser');
const path = require('path');
const app = express(); // initialize a new object where express.js will store and manager our app
app.set('view engine','pug'); // setting default template engine to pug
app.set('views','views');//where i am keeping my html files
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public'))); // serving files statically so user can access them
//filtering paths
app.use('/admin',adminData.routes);//acessing routes object
app.use(shopRoutes);
//adding 404 error page , use: handles all http methods not only get requests
app.use((req,res,next)=>{
res.status(404).render('404');
});


app.listen(3000);