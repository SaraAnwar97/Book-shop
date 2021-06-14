exports.get404Page = (req,res,next)=>{
    res.status(404).render('404' ,{pageTitle : 'Page not found', path :'/404',isAuthententicated: req.session.isLoggedIn });
    };

exports.get500Page = (req,res,next)=>{
    res.status(500).render('500' ,{pageTitle : ' Error', path :'/500' ,isAuthententicated: req.session.isLoggedIn});
    };