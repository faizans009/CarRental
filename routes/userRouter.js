const express = require('express');
const userCRUD = require('../controllers/userController')
const userEmail = require('../controllers/emailController')
const router = express.Router()

router.
    post('/signup', userCRUD.signUp)
    .get('/getUser', userCRUD.getUser)
    .post('/email', userEmail.sendEmail)
    .post('/login', userCRUD.signIn)
    .post('/validateOTP', userCRUD.validateOTP)
    .post('/resetPassword', userCRUD.resetPassword)
    .post('/profile', userCRUD.profile)
    .get('/getProfile', userCRUD.profile)
    .patch('/updateProfile', userCRUD.profile)
    

exports.router = router

