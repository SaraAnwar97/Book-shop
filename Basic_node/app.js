const path = require('path');
const express = require('express');
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const errorController = require('./controllers/404');
const User = require('./models/users');
const MONGODB_URI = 'mongodb+srv://Sara:Ss4923@@@cluster0.ldpfv.mongodb.net/shop';
const app = express();
const flash = require('connect-flash');
const store = new mongoDBStore({
uri: MONGODB_URI,
collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine','ejs'); // setting default template engine to ejs
app.set('views','views');//where i am keeping my html files
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authenticationRoutes = require('./routes/authentication');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public'))); // serving files statically so user can access them
app.use(session(
  {secret: 'my secret', 
  resave:false,
  saveUninitialized:false,
  store: store
})
);
app.use(csrfProtection);
app.use(flash());
app.use((req,res,next)=>{
  if(!req.session.user){
   return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
    req.user = user;
   next();
  })
  .catch(err => console.log(err));
});

app.use((req,res,next) =>{
res.locals.isAuthenticated = req.session.isLoggedIn;
res.locals.csrfToken = req.csrfToken();
next();
});

// filt ering paths
app.use('/admin',adminRoutes);//acessing routes object
app.use(shopRoutes);
app.use(authenticationRoutes);
//adding 404 error page , use: handles all http methods not only get requests
app.use(errorController.get404Page);
//const url = 'mongodb+srv://Sara:Ss4923@cluster0.ldpfv.mongodb.net/shop?retryWrites=true&w=majority';
//const url = 'mongodb+srv://Sara:Ss4923@@@cluster0.ldpfv.mongodb.net/shop?retryWrites=true&w=majority';
mongoose
.connect(MONGODB_URI,{useNewUrlParser: true },{ useUnifiedTopology: true })
.then(result => {
  app.listen(3000);
})
.catch(err => {
  console.log(err);
});