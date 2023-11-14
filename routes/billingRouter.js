const express = require('express')
const router = express.Router()
const Billing = require('../controllers/billingController')
const { isAuthenticatedUser } = require('../middlewares/auth');

router
.post('/createBilling', isAuthenticatedUser, Billing.createBillingInfo)
.get('/getBilling', isAuthenticatedUser, Billing.getBillingInfo)

exports.router = router 