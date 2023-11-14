const express = require('express');
const router = express.Router();
const review = require('../controllers/reviewController'); 
const {isAuthenticatedUser} = require('../middlewares/auth');

router
    .post('/createReview', isAuthenticatedUser, review.createReview)
    .get('/getReview',isAuthenticatedUser,review.getReview)

exports.router = router;