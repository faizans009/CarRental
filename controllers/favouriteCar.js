const User = require("../models/user");
const Car = require("../models/carModel");
const ResponseHandler = require("../utils/responseHandler");

// favourite car
exports.favouriteCar = async (req, res) => {
  try {
    const { carId } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return new ResponseHandler(res, 404, false, "User not found");
    }
    const car = await Car.findById(carId);
    if (!car) {
      return new ResponseHandler(res, 404, false, "Car not found");
    } 
    user.favouriteCar.push(carId); 
    await user.save();
    return new ResponseHandler(res, 200, true, "Car added to favorites");
  } catch (error) {
    console.error(error.message);
    return new ResponseHandler(res, 500, false, "Internal server error");
  }
};

exports.unFavouriteCar = async (req, res) => {
  try {
    const { carId } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return new ResponseHandler(res, 404, false, "User not found");
    }

    // Check if the carId is defined
    if (!carId) {
      return new ResponseHandler(res, 400, false, "Invalid carId");
    }

    // Filter out the carId from the user's favorites
    user.favouriteCar = user.favouriteCar.filter(
      (favorite) => favorite.car && favorite.car.toString() !== carId.toString()
    );

    // Save the updated user object
    await user.save();

    return new ResponseHandler(res, 200, true, "Car removed from favorites");
  } catch (error) {
    console.error(error.message);
    return new ResponseHandler(res, 500, false, "Internal server error");
  }
};
