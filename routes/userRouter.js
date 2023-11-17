const express = require('express');
const userCRUD = require('../controllers/userController')
const userEmail = require('../controllers/emailController')
const router = express.Router()
const {upload} = require('../middlewares/multer');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.
    post('/signup', userCRUD.signUp)
    .get('/getUser', userCRUD.getUser)
    .post('/email', userEmail.sendEmail)
    .post('/login', userCRUD.signIn)
    .post('/validateOTP', userCRUD.validateOTP)
    .post('/resetPassword', userCRUD.resetPassword)
    .patch('/updateProfile/:id',isAuthenticatedUser,upload.single('profileImage'), userCRUD.profile)
    

exports.router = router

