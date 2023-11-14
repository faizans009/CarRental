const User = require("../models/user");
const Car = require("../models/carModel");

exports.favouriteCar = async (req, res) => {
  try {
    const {userId,carId} = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(500).json({ message: "user not found" });
    }
    // const isAlreadyFavourite = user.favouriteCar.car.includes(carId)
    const isAlreadyFavourite = user.favouriteCar.filter(f => f._id.toString() === carId.toString())
    if (isAlreadyFavourite) {
    return res.status(400).json({ message: "Car is already a favorite" });
  }
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
  
  user.favouriteCar.push(carId);
  await user.save();

    return res.status(200).json({ message: "Car added to favorites" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

exports.unFavouriteCar = async (req, res) => {
  try {
    const {userId,carId} = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(500).json({ message: "user not found" });
    }
    // Check if the car is in the user's favorites
    
    user.favouriteCar = user.favouriteCar.filter((favorite) => favorite.car && favorite.car.toString() !== carId);

    await user.save();

    return res.status(400).json({ message: 'Car remove from favorites' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};
