const express = require('express');
const router = express.Router();
const favourite = require('../controllers/favouriteCar')
const { isAuthenticatedUser } = require('../middlewares/auth');
router
    .post('/favoriteCar', isAuthenticatedUser, favourite.favouriteCar)
    .post('/unFavoriteCar', isAuthenticatedUser, favourite.unFavouriteCar)
    .get('/getFavouriteCars', isAuthenticatedUser, favourite.getFavouriteCars)

exports.router = router;