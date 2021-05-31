const express = require('express');
const authenticationController = require('../controllers/authentication');
const router = express.Router();

router.get('/login', authenticationController.getLogin);
router.post('/login', authenticationController.postLogin);
router.post('/logout',authenticationController.postLogout);
router.get('/signup',authenticationController.getSignup);
router.post('/signup',authenticationController.postSignup);
router.get('/reset', authenticationController.getReset);
router.post('/reset', authenticationController.postReset);
module.exports = router;