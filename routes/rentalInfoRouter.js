const express = require('express')
const router = express.Router()
const Rental = require('../controllers/rentalInfoController')
const { isAuthenticatedUser } = require('../middlewares/auth');
router
.post('/createRentalInfo', isAuthenticatedUser, Rental.createRentalInfo)
.get('/getRentalInfo', isAuthenticatedUser, Rental.getRentalInfo)

exports.router = router 