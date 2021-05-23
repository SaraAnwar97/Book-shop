const bcrypt = require('bcryptjs');
const User = require('../models/users');
exports.getLogin = (req,res,next) => {
// const isLoggedIn = req.get('Cookie').split('=')[1];
  //console.log(req.get('Cookie').split(';')[1].trim().split('=')[1]); //headername:Cookie
  console.log(req.session.isLoggedIn);
  res.render('authentication/login',{
            path : '/login',
            pageTitle: 'Login',
            isAuthenticated: false
      });

    };


    exports.postLogin = (req,res,next) => {
     User.findById("60a1d3760fd0460b2f1cc4c5")
     .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err=>{
        console.log(err);
        res.redirect('/');
      })
      //res.redirect('/');
     })
     .catch(err => console.log(err));
  };


 exports.getSignup = (req,res,next) => {
   res.render('authentication/signup',{
     path: '/signup',
     pageTitle: 'Signup',
     isAuthenticated : false
   });
 };

 exports.postSignup = (req,res,next) => {
   const email = req.body.email;
   const password = req.body.password;
   const confirmPassword = req.body.confirmPassword;
   User.findOne({ email: email })
   .then(userDoc =>{
     if(userDoc) //user exists
     {
       return res.redirect('/signup');
     }
    return bcrypt.hash(password,12
      .then(hashedPassword =>{
        //user does not exist
        const user = new User({
         email: email,
         password: hashedPassword,
         cart: {items:[]}
       });
       return user.save();
      })
      .then(result =>{
        res.redirect('/login');
      })
      );
   })
   
   .catch(err =>{
     console.log(err);
   });
 };

 exports.postLogout = (req,res,next) => {
  req.session.destroy((err)=>{
    console.log(err);
    res.redirect('/')
  });
 };