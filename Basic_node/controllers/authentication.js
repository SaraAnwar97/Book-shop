const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {validationResult} = require('express-validator/check');
const User = require('../models/users');
//configure transporter
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: { // can use username & password
    api_key: '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'
  }
}));
exports.getLogin = (req,res,next) => {
// const isLoggedIn = req.get('Cookie').split('=')[1];
  //console.log(req.get('Cookie').split(';')[1].trim().split('=')[1]); //headername:Cookie
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  }else{
    message = null;
  }
  res.render('authentication/login',{
            path : '/login',
            pageTitle: 'Login',
            errorMessage: message,
            oldInput : {
              email : "",
              password : ""
            },
            validationErrors : []
      });

    };


    exports.postLogin = (req,res,next) => {
      const email = req.body.email;
      const password = req.body.password;
      const errors= validationResult(req); // gathers all erros collected by that package
      if(!errors.isEmpty()){
     return res.status(422).render('authentication/login',{
      path: '/login',
      pageTitle: 'Login',
      errorMessage : errors.array()[0].msg,
      oldInput : {
        email : email,
        password : password
      },
      validationErrors : errors.array()
   });
      }
     User.findOne({email: email})
     .then(user => {
       if(!user){ //user not found
         return res.status(422).render('authentication/login',{
          path: '/login',
          pageTitle: 'Login',
          errorMessage : 'Invalid email or password',
          oldInput : {
            email : email,
            password : password
          },
          validationErrors :[]
       });
       }
       bcrypt.compare(password, user.password)
       .then(doMatch =>{
         if(doMatch){
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err=>{
            console.log(err);
            res.redirect('/');
          });
         }
         return res.status(422).render('authentication/login',{
          path: '/login',
          pageTitle: 'Login',
          errorMessage : 'Invalid email or password',
          oldInput : {
            email : email,
            password : password
          },
          validationErrors :[]
       });

       })
       .catch(err =>{
         console.log(err);
         res.redirect('/login');
       });
    
     })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  };


 exports.getSignup = (req,res,next) => {
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  }else{
    message = null;
  }
   res.render('authentication/signup',{
     path: '/signup',
     pageTitle: 'Signup',
     errorMessage : message,
     oldInput : {
       email:"",
       password: "",
       confirmPassword: ""
     },
     validationErrors : []
   });
 };

 exports.postSignup = (req,res,next) => {
   const email = req.body.email;
   const password = req.body.password;
   //const confirmPassword = req.body.confirmPassword;
   const errors = validationResult(req);
   if(!errors.isEmpty()){
     console.log(errors.array())//prints an arr of err objects
     return res.status(422).render('authentication/signup',{
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage : errors.array()[0].msg,
      oldInput: {email:email,
         password:password , 
         confirmPassword: req.body.password } ,
         validationErrors : errors.array() // arr of errs
   });
  }
    bcrypt.hash(password,12)
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
        //returns a promise
        transporter.sendMail({
          to: email,
          //verified email in sendgrid sender authentication
          from: 'saraanwar97@gmail.com',
          subject: 'signup succeeded!',
          html: '<h1> you successfully signed up! </h1>'
        });
      }).catch(err =>{
        const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
      });
 };

 exports.postLogout = (req,res,next) => {
  req.session.destroy((err)=>{
    console.log(err);
    res.redirect('/')
  });
 };

 exports.getReset = (req,res,next)=>{
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  }else{
    message = null;
  }
  res.render('authentication/reset',{
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage : message
  });
 };

 exports.postReset = (req,res,next) =>{
   crypto.randomBytes(32,(err,buffer)=>{
     if(err){
       console.log(err);
       return res.redirect('/reset');
     }
     const token = buffer.toString('hex');
     User.findOne({email : req.body.email})
     .then(user =>{
      if(!user){
        req.flash('error','No account with that email found');
        return res.redirect('/reset');
      }
      //user with entered email found
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000; //1 hr in milliseconds
      return user.save();
    }).then(result =>{
      res.redirect('/');
      transporter.sendMail({
        to: req.body.email,
        //verified email in sendgrid sender authentication
        from: 'saraanwar97@gmail.com',
        subject: 'Password Reset',
        html:`
        <p> You requested a password reset </p>
        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
        `
      });
    })
     .catch(err=>{
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
     });
   });

 };

 exports.getNewPassword = (req,res,next) => {
const token = req.params.token;
User.findOne({resetToken : token , resetTokenExpiration: {$gt: Date.now()}})
.then(user => {
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  }else{
    message = null;
  }
  res.render('authentication/new-password',{
    path: '/new-password',
    pageTitle: 'New Password',
    errorMessage : message,
    userId : user._id.toString(),
    passwordToken: token
  });
})
.catch(err =>{
  const error = new Error(err);
  error.httpStatusCode = 500;
  return next(error);
});
 };

exports.postNewPassword = (req,res,next) =>{
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: {$gt : Date.now() },
    _id : userId
  })
  .then(user =>{
    resetUser = user;
    return bcrypt.hash(newPassword,12);
  }).then(hashedPassword =>{
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save();
  }).then(result =>{
    res.redirect('/login');
    transporter.sendMail({
      to: resetUser.email,
      //verified email in sendgrid sender authentication
      from: 'saraanwar97@gmail.com',
      subject: 'Password updated',
      html:'Your password is updated'
    });

  }).catch(err =>{
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  })

};
