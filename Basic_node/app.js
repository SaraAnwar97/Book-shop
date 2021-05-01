const express = require('express');
const bodyParser=require('body-parser');
const app = express(); // initialize a new object where express.js will store and manager our app

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({extended:false}));

app.use(adminRoutes);
app.use(shopRoutes);

app.listen(3000);