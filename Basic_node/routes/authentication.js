const express = require('express');
const authenticationController = require('../controllers/authentication');
const router = express.Router();

router.get('/login', authenticationController.getLogin);
module.exports = router;