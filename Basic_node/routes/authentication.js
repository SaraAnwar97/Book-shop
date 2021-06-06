const express = require('express');
const {check, body} = require('express-validator/check');
const authenticationController = require('../controllers/authentication');
const User = require('../models/users');
const router = express.Router();

router.get('/login', authenticationController.getLogin);
router.post('/login',
[body('email','Incorrect email').isEmail().normalizeEmail(),
body('password','Incorrect password').isLength({min:5 , max:10}).isAlphanumeric().trim()

],
 authenticationController.postLogin);
router.post('/logout',authenticationController.postLogout);
router.get('/signup',authenticationController.getSignup);
router.post('/signup', 
[check('email').isEmail().withMessage('Please enter a valid email').custom((value  , {req})=>{
    // if(value === 'test@test.com'){
    //     throw new Error('this email is forbidden');
    // }
    // return true;
   return User.findOne({ email: value })
    .then(userDoc =>{
      if(userDoc) //user exists
      {return Promise.reject('Email exists already, please choose a different one');
      }
});
}).normalizeEmail(),
body('password',
'Please enter a password with only numbers , text , at least 5 characters and at most 10 characters'
).isLength({min: 5, max:10}).isAlphanumeric().trim(),
body('confirmPassword').custom((value,{req})=>{
    if(value !== req.body.password){
        throw new Error ('Passwords have to match!');
    }
    return true;
}).trim()
]
,authenticationController.postSignup);
router.get('/reset', authenticationController.getReset);
router.post('/reset', authenticationController.postReset);
router.get('/reset/:token', authenticationController.getNewPassword);
router.post('/new-password', authenticationController.postNewPassword);
module.exports = router;