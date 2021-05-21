const express = require('express');
const authenticationController = require('../controllers/authentication');
const router = express.Router();

router.get('/login', authenticationController.getLogin);
router.post('/login', authenticationController.postLogin);
module.exports = router;