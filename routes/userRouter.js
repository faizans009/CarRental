const express = require('express');
const userCRUD = require('../controllers/userController')
const userEmail = require('../controllers/emailController')
const router = express.Router()
const {upload} = require('../middlewares/multer');
const { isAuthenticatedUser } = require('../middlewares/auth');

router
    .post('/signup', userCRUD.signUp)
    .get('/getUser',isAuthenticatedUser, userCRUD.getUser)
    .get('/getAllUsers',isAuthenticatedUser, userCRUD.getAllUsers)
    .delete('/deleteUser/:id',isAuthenticatedUser, userCRUD.deleteUser)
    .post('/login', userCRUD.signIn)
    .post('/validateOTP', userCRUD.validateOTP)
    .post('/forgetPassword', userCRUD.forgetPassword)
    .post('/resetPassword', userCRUD.resetPassword)
    // .patch('/updateProfile/:id',isAuthenticatedUser,upload.single('profileImage'), userCRUD.profile)
    

exports.router = router

