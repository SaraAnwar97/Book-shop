const express = require('express');
const {check} = require('express-validator/check');
const authenticationController = require('../controllers/authentication');
const router = express.Router();

router.get('/login', authenticationController.getLogin);
router.post('/login', authenticationController.postLogin);
router.post('/logout',authenticationController.postLogout);
router.get('/signup',authenticationController.getSignup);
router.post('/signup', check('email').isEmail(),authenticationController.postSignup);
router.get('/reset', authenticationController.getReset);
router.post('/reset', authenticationController.postReset);
router.get('/reset/:token', authenticationController.getNewPassword);
router.post('/new-password', authenticationController.postNewPassword);
module.exports = router;