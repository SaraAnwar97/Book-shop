const path = require('path');
const express = require('express');
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const errorController = require('./controllers/404');
const User = require('./models/users');
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ldpfv.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`
const app = express();
const flash = require('connect-flash');
const multer = require('multer');

console.log(process.env.NODE_ENV);
const store = new mongoDBStore({
uri: MONGODB_URI,
collection: 'sessions'
});
const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'images');
  },
  filename:(req,file,cb) =>{
    //if two images have same name , they do not override
    cb(null, new Date().toISOString() + '_'  + file.originalname); 
  }

});

const fileFilter = (req,file,cb) =>{
  if(file.mimetype === 'image/png'||
     file.mimetype === 'image/jpg'||
     file.mimetype === 'image/jpeg'){
       cb(null,true);
     }else{
       cb(null,false);
     }

};

app.set('view engine','ejs'); // setting default template engine to ejs
app.set('views','views');//where i am keeping my html files
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authenticationRoutes = require('./routes/authentication');

app.use(bodyParser.urlencoded({extended:false}));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use(express.static(path.join(__dirname,'public'))); // serving files statically so user can access them
app.use('/images',express.static(path.join(__dirname,'images'))); 
app.use(session(
  {secret: 'my secret', 
  resave:false,
  saveUninitialized:false,
  store: store
})
);
app.use(csrfProtection);
app.use(flash());

app.use((req,res,next) =>{
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
  });

app.use((req,res,next)=>{
  //throw new Error('Sync dummy'); //techincal error
  if(!req.session.user){
   return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
    if(!user){
      return next(); //making sure we dont save an undefined user obj
    }
    req.user = user;
   next();
  })
  .catch(err => {
   next(new Error(err));
  });
});


// filt ering paths
app.use('/admin',adminRoutes);//acessing routes object
app.use(shopRoutes);
app.use(authenticationRoutes);
app.get('/500',errorController.get500Page);
//adding 404 error page , use: handles all http methods not only get requests
app.use(errorController.get404Page);
//const url = 'mongodb+srv://Sara:Ss4923@cluster0.ldpfv.mongodb.net/shop?retryWrites=true&w=majority';
//const url = 'mongodb+srv://Sara:Ss4923@@@cluster0.ldpfv.mongodb.net/shop?retryWrites=true&w=majority';
app.use((error,req,res,next)=>{
  //res.status(error.httpStatusCode).render(...);
 // res.redirect('/500');
 //console.log(error);
  res.status(500)
  .render('500' ,{pageTitle : ' Error',
   path :'/500' ,
   isAuthententicated: req.session.isLoggedIn});
});

mongoose.connect(MONGODB_URI,{useNewUrlParser: true },{ useUnifiedTopology: true })
.then(result => {
  app.listen(process.env.PORT || 3000);
})
.catch(err => {
  console.log(err);
}); 