const favouriteService = require('../services/favouriteCarService')
const ResponseHandler = require("../utils/responseHandler")
exports.favouriteCar = async (req, res) => {
  try {
    const { userId, carId } = req.body;
    await favouriteService.addToFavorites(userId, carId);
    return new ResponseHandler(res, 200, true, "Car added to favorites");
  } catch (error) {
    return new ResponseHandler(res, 500, false, error.message);
  }
};

exports.unFavouriteCar = async (req, res) => {
  try {
    const { userId, carId } = req.body;
    await favouriteService.removeFromFavorites(userId, carId);
    // await favouriteService.removeFromFavorites(userId, carId);
    return new ResponseHandler(res, 200, true, "Car removed from favorites");
  } 
  catch (error) {
    return new ResponseHandler(res, 500, false, error.message);
  }
};