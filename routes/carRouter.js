const express = require('express');
const router = express.Router();
const car = require('../controllers/carController')
const {upload} = require('../middlewares/multer');
const { isAuthenticatedUser } = require('../middlewares/auth');
router
    .post('/createCar', isAuthenticatedUser, upload.array('image', 6), car.createCar)
    .get('/getCar',isAuthenticatedUser, car.getCar)
    .get('/getOneCar/:id',isAuthenticatedUser, car.getOneCar)
    .put('/updateCar/:id', isAuthenticatedUser, upload.array('image', 6), car.updateCar)
    .delete('/deleteCar/:id', isAuthenticatedUser, car.deleteCar)
 
exports.router = router 