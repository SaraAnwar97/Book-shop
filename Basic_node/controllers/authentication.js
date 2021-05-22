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
      res.redirect('/');
     })
     .catch(err => console.log(err));
  };


  exports.postLogout = (req,res,next) => {
  req.session.destroy((err)=>{
    console.log(err);
    res.redirect('/')
  });
 };