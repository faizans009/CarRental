const express = require('express');
const router = express.Router();
const contactUs = require('../controllers/contactUsController')
const { isAuthenticatedUser } = require('../middlewares/auth');

router
    .post('/createContact', isAuthenticatedUser, contactUs.createContactUs)

exports.router = router;