// favoriteCarService.js

const User = require("../models/user");
const Car = require("../models/carModel");


   async function addToFavorites(userId, carId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const isAlreadyFavourite = user.favouriteCar.some(f => f.toString() === carId.toString());
      if (isAlreadyFavourite) {
        throw new Error("Car is already a favorite");
      }

      const car = await Car.findById(carId);
      if (!car) {
        throw new Error("Car not found");
      }

      user.favouriteCar.push(carId);
      await user.save();
    } catch (error) {
      throw error;
    }
  }


     async function removeFromFavorites(userId, carId) {
      try {
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User not found");
        }
  
        user.favouriteCar = user.favouriteCar.filter((favorite) => favorite.toString() !== carId);
  
        await user.save();
      } catch (error) {
        throw error;
      }
    }
  
module.exports = {addToFavorites,removeFromFavorites}
