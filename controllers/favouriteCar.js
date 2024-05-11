const User = require("../models/user");
const Car = require("../models/carModel");
const ResponseHandler = require("../utils/responseHandler");
const mongoose = require("mongoose");

// favourite car


exports.favouriteCar = async (req, res) => {
  try {
    const { carId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const car = await Car.findById(carId);

    if (!user || !car) {
      return new ResponseHandler(res, 404, false, "User or car not found");
    }
    const carObjectId =new mongoose.Types.ObjectId(carId);
    if (user.favouriteCar.some(id => id.equals(carObjectId))) {
      return new ResponseHandler(res, 400, false, "Car already in favorites");
    }


    user.favouriteCar.push(carId); 
    await user.save();
    
    car.isFavourite = true;
    await car.save();

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

    const car = await Car.findById(carId);
    if (!car) {
      return new ResponseHandler(res, 404, false, "Car not found");
    }

    const carObjectId =new mongoose.Types.ObjectId(carId);
    if (user.favouriteCar.some(id => id.equals(carObjectId))) {
      const index = user.favouriteCar.findIndex(id => id.equals(carObjectId));
      if (index !== -1) {
        user.favouriteCar.splice(index, 1);
        await user.save();
        car.isFavourite = false;
        await car.save();
        return new ResponseHandler(res, 200, true, "Car removed from favorites");
      } else {
        return new ResponseHandler(res, 400, false, "Car not in favorites");
      }
    }  else {
      return new ResponseHandler(res, 400, false, "Car not in favorites");
    }
  

  } catch (error) {
    console.error(error.message);
    return new ResponseHandler(res, 500, false, "Internal server error");
  }
};


// get favourite cars

exports.getFavouriteCars = async (req, res) => {
  try {
    const userId = req.user.id;
    const user =  await  User.findById(userId);
    if (!user) {
      return new ResponseHandler(res, 404, false, "User not found");
    }
    const favouriteCars = user.favouriteCar;
    if (!favouriteCars.length) {
      return new ResponseHandler(res, 404, false, "No favourite car found");
    }
      const carIds = favouriteCars.map(car => car._id);
      const cars = await Car.find({ _id: { $in: carIds } });

    
    return new ResponseHandler(res, 200, true, "Get favourite cars successfully", cars);
    
  } catch(error) {
    console.error(error.message);
    return new ResponseHandler(res, 500, false, "Internal server error");
  }
}

