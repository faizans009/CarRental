const User = require("../models/user");
const Car = require("../models/carModel");
const ResponseHandler = require("../utils/responseHandler")

exports.favouriteCar = async (req, res) => {
  try {
    const {userId,carId} = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return new ResponseHandler(res, 500,false,"user not found" )
    }
    
    const isAlreadyFavourite = user.favouriteCar.filter(f => f._id.toString() === carId.toString())
    if (isAlreadyFavourite) {
      return new ResponseHandler(res, 400,false,"Car is already a favorite" )
  }
    const car = await Car.findById(carId);
    if (!car) {
      return new ResponseHandler(res, 404,false,"Car not found" )
    }
  
  user.favouriteCar.push(carId);
  await user.save();
  return new ResponseHandler(res, 200,true,"Car added to favorites" )
  } catch (error) {
    return new ResponseHandler(res, 500,false,error.message )
  }
};

exports.unFavouriteCar = async (req, res) => {
  try {
    const {userId,carId} = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return new ResponseHandler(res, 500,false,"user not found" )
    }
    
    user.favouriteCar = user.favouriteCar.filter((favorite) => favorite.car && favorite.car.toString() !== carId);

    await user.save();
    return new ResponseHandler(res, 400,true,"Car remove from favorites" )
  } catch (error) {
    return new ResponseHandler(res, 500,false,error.message )
  }
};
