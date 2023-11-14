const Car = require("../models/carModel");
const fs = require("fs");
// create cars
exports.createCar = async (req, res) => {
  const {
    companyName,
    carName,
    carType,
    fuelCapacity,
    steering,
    capacity,
    make,
    model,
    registrationCity,
    transmission,
    favourite,
    rating,
    reviews,
    condition,
    fuelType,
    carDesc,
  } = req.body;

  if (req.user._id && req.user.admin) {
    try {
      // 'req.file' contains information about the uploaded image
      const images = req.files.map((file) => file.path);

      const newCar = await Car.create({
        companyName: companyName,
        image: images,
        carName: carName,
        carType: carType,
        fuelCapacity: fuelCapacity,
        steering: steering,
        capacity: capacity,
        make: make,
        model: model,
        registrationCity: registrationCity,
        transmission: transmission,
        favourite: favourite,
        rating: rating,
        reviews: reviews,
        condition: condition,
        fuelType: fuelType,
        carDesc: carDesc,
      });

      return res
        .status(200)
        .json({ message: "Car created successfully", newCar });
    } catch (error) {
      console.log(error);

      return res
        .status(500)
        .json({ message: "something went wrong", error: error.message });
    }
  } else {
    return res
      .status(403)
      .json({ message: "Unauthorized. Only admin users can create cars." });
  }
};

// get all cars
exports.getCar = async (req, res) => {
  try {
    const cars = await Car.find();
    if (cars.length === 0) {
      return res.status(404).json({ message: "No cars found" });
    }

    return res.status(200).json({ cars: cars });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "unable to get car", error: error.message });
  }
};

// get one car
exports.getOneCar = async (req, res) => {
  const { id } = req.params;
  try {
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    return res.status(200).json({ message: "car found", car });
  } catch (error) {
    return res
      .status(200)
      .json({ message: "car not found", error: error.message });
  }
};

// update car

exports.updateCar = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if a new image file is uploaded and update the image path in updateData
  if (req.file) {
    updateData.image = req.file.path;
  }

  try {
    // Find the car by its ID
    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Check if an old image exists and if a new image is uploaded
    if (req.file && car.image) {
      // Delete the old image
      fs.unlinkSync(car.image);
    }

    // Update the car data and return the updated car
    const updatedCar = await Car.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    return res.status(200).json({ car: updatedCar });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to update car", error: error.message });
  }
};

// delete car
exports.deleteCar = async (req, res) => {
  const { id } = req.params;
  try {
    // const car = await Car.findById(id)
    // if (!car) {
    //     return res.status(404).json({ message: 'Car not found' });
    // }

    // Delete the car from the database
    await Car.findByIdAndRemove(id);
    return res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Car not deleted", error: error.message });
  }
};
