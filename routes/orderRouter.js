const express = require('express')
const router = express.Router()
const { isAuthenticatedUser } = require('../middlewares/auth');
const order = require('../controllers/orderController')
router
.post("/createOrder", isAuthenticatedUser, order.createOrder) 
.get("/getOrder", isAuthenticatedUser, order.getOrder)
.get("/getUserOrder", isAuthenticatedUser, order.userOrders)
.put("/updateStatus",isAuthenticatedUser,  order.updateStatus)
exports.router = router