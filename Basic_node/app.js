const express = require('express');
const bodyParser=require('body-parser');
const path = require('path');
const app = express(); // initialize a new object where express.js will store and manage our app
const errorController = require('./controllers/404');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/users');
app.set('view engine','ejs'); // setting default template engine to ejs
app.set('views','views');//where i am keeping my html files
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public'))); // serving files statically so user can access them

app.use((req, res, next) => {
  User.findById("609f3246fde39bab9bc98f86")
    .then(user => {
     // req.user = user; storing user with id in our req from db
      req.user = new User(user.name,user.email,user.cart,user._id); // creating a user obj to interact with
      next();
    })
    .catch(err => console.log(err));
});
//filtering paths
app.use('/admin',adminRoutes);//acessing routes object
app.use(shopRoutes);
//adding 404 error page , use: handles all http methods not only get requests
app.use(errorController.get404Page);


mongoConnect(()=>{
app.listen(3000);
});