exports.getLogin = (req,res,next) => {
 const isLoggedIn = req.get('Cookie').split('=')[1];
  //console.log(req.get('Cookie').split(';')[1].trim().split('=')[1]); //headername:Cookie
        res.render('authentication/login',{
            path : '/login',
            pageTitle: 'Login',
            isAuthenticated: isLoggedIn
      });

    };


    exports.postLogin = (req,res,next) => {
     res.setHeader('Set-Cookie', 'loggenIn = true' );
     res.redirect('/');

  };