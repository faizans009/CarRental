const express = require('express');
const router = express.Router();
const car = require('../controllers/carController')
const {upload} = require('../middlewares/multer');
const { isAuthenticatedUser } = require('../middlewares/auth');
router
    .post('/createCar', isAuthenticatedUser, car.createCar)
    .get('/getAllCars', car.getAllCars)
    .get('/getOneCar/:id', car.getOneCar)
    .get('/getCarsByCategory',isAuthenticatedUser, car.getCarsByCategory)
    .get('/getPopularCars', car.getPopularCars)
    .patch('/updateCar/:id', isAuthenticatedUser,car.updateCar)
    .delete('/deleteCar/:id', isAuthenticatedUser, car.deleteCar)
    .post('/singleUpload', isAuthenticatedUser,upload.single('image'), car.singleUpload)
    .post('/multipleUpload', isAuthenticatedUser,upload.array('images', 6), car.multiUpload)
 
exports.router = router     