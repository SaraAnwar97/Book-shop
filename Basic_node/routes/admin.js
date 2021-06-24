const express = require('express');
const path = require('path');
const adminController = require('../controllers/admin');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const { body } = require('express-validator/check');
//admin/add-product => GET
 router.get('/add-product',isAuth, adminController.getAddProduct);
// // /admin/product-list
router.get('/product-list',isAuth, adminController.getProductList);
//admin/add-product => POST
 router.post('/add-product',
 [
     body('title').isString().isLength({min:3}).trim(),
     body('price').isFloat(),
     body('description').isLength({min:5 , max: 200}).trim(),
     
 ]
 ,isAuth,adminController.postAddProduct);  
 router.get('/edit-product/:productId',isAuth, adminController.getEditProduct); 
 router.post('/edit-product',
 [
    body('title').isString().isLength({min:3}).trim(),
    body('price').isFloat(),
    body('description').isLength({min:5 , max: 200}).trim(),
    
]
 , isAuth, adminController.postEditProduct);
 router.delete('/product-list/:productId',isAuth, adminController.deleteProduct);
module.exports = router;