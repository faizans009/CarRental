const express = require('express');
const router = express.Router();
const {upload} = require('../middlewares/multer');
const { isAuthenticatedUser } = require('../middlewares/auth');
const category = require('../controllers/categoryController')
    
router
    .post('/createCategory', isAuthenticatedUser,upload.single('categoryImage'), category.createCategory)
    .get('/getCategory', category.getCategory)
    .get('/getOneCategory/:id', category.getOneCategory)
    .put('/updateCategory/:id', isAuthenticatedUser,upload.single('categoryImage'), category.updateCategory)
    .delete('/deleteCategory/:id', isAuthenticatedUser, category.deleteCategory)
    exports.router = router 
    