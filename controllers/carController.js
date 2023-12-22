const Car = require("../models/carModel");
const Category = require("../models/categoryModel");
const ResponseHandler = require("../utils/responseHandler");
const fs = require("fs");
// create cars
// exports.createCar = async (req, res) => {
//   if (
//     (req.user._id && req.user.role === "admin") ||
//     req.user.role === "superAdmin"
//   ) {
//     try {
//       const category = await Category.findOne(req.body.categoryId);

//       if (!category) {
//         return new ResponseHandler(res, 404, false, " car category not found");
//       }
//       const newCar = await Car.create({
//         categoryId: req.body.categoryId,
//         companyName: req.body.companyName,
//         image: req.body.images,
//         bannerImage: req.body.bannerImage,
//         carName: req.body.carName,
//         carType: req.body.carType,
//         fuelCapacity: req.body.fuelCapacity,
//         steering: req.body.steering,
//         capacity: req.body.capacity,
//         make: req.body.make,
//         model: req.body.model,
//         registrationCity: req.body.registrationCity,
//         transmission: req.body.transmission,
//         favourite: req.body.favourite,
//         rating: req.body.rating,
//         reviews: req.body.reviews,
//         condition: req.body.condition,
//         fuelType: req.body.fuelType,
//         carDesc: req.body.carDesc,
//         price: req.body.price,
//       });
//       return new ResponseHandler(
//         res,
//         200,
//         true,
//         "Car created successfully",
//         newCar
//       );
//     } catch (error) {
//       return new ResponseHandler(res, 500, false, error.message);
//     }
//   } else {
//     return new ResponseHandler(
//       res,
//       403,
//       false,
//       "Unauthorized. Only admin users can create cars."
//     );
//   }
// };
exports.createCar = async (req, res) => {
  try {
    // Check if the user is authorized to create cars
    if (!(req.user.role === "admin" || req.user.role === "superAdmin")) {
      return new ResponseHandler(res, 403, false, "Unauthorized. Only admin or super admin can create cars.");
    }

    // Check if the category exists
    const category = await Category.findById(req.body.categoryId);
    if (!category) {
      return new ResponseHandler(res, 404, false, "Car category not found");
    }

    // Create a new car
    const newCar = await Car.create({
      categoryId: req.body.categoryId,
      companyName: req.body.companyName,
      images: req.body.images, // Assuming images is an array of image paths
      bannerImage: req.body.bannerImage,
      carName: req.body.carName,
      carType: req.body.carType,
      fuelCapacity: req.body.fuelCapacity,
      steering: req.body.steering,
      capacity: req.body.capacity,
      make: req.body.make,
      model: req.body.model,
      registrationCity: req.body.registrationCity,
      transmission: req.body.transmission,
      favourite: req.body.favourite,
      rating: req.body.rating,
      reviews: req.body.reviews,
      condition: req.body.condition,
      fuelType: req.body.fuelType,
      carDesc: req.body.carDesc,
      price: req.body.price,
    });

    // Return success response with the new car object
    return new ResponseHandler(res, 201, true, "Car created successfully", newCar);
  } catch (error) {
    // Handle errors
    console.error(error.message);
    return new ResponseHandler(res, 500, false, "Internal server error");
  }
};
// // get all cars
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    if (cars.length === 0) {
      return new ResponseHandler(res, 404, false, "No cars found");
    }
    return new ResponseHandler(res, 200, true, "Car found", cars);
  } catch (error) {
    return new ResponseHandler(res, 500, false, error.message);
  }
};

// get one car
exports.getOneCar = async (req, res) => {
  const { id } = req.params;
  try {
    const car = await Car.findById(id);

    if (!car) {
      return new ResponseHandler(res, 404, false, "Car not found");
    }

    return new ResponseHandler(res, 200, true, "Car found", car);
  } catch (error) {
    return new ResponseHandler(res, 500, false, error.message);
  }
};

// update car

exports.updateCar = async (req, res) => {
  if (
    (req.user._id && req.user.role === "admin") ||
    req.user.role === "superAdmin"
  ) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // if (req.files) {
      //   updateData.image =  req.files.map((file) => file.path);
      // }

      const updatedCar = await Car.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!updatedCar) {
        return new ResponseHandler(res, 404, false, "Car not found");
      }
      if (updateData.image && updatedCar.image) {
        updatedCar.image.forEach((file) => {
          fs.unlinkSync(file);
        });
      }

      return new ResponseHandler(res, 200, true, "Car Updated", updatedCar);
    } catch (error) {
      return new ResponseHandler(res, 500, false, error.message);
    }
  } else {
    return new ResponseHandler(
      res,
      403,
      false,
      "Unauthorized. Only admin users can create cars."
    );
  }
};

// delete car
exports.deleteCar = async (req, res) => {
  if (
    (req.user._id && req.user.role === "admin") ||
    req.user.role === "superAdmin"
  ) {
    try {
      const { id } = req.params;
      console.log(id);
      // await Car.findByIdAndDelete(id);
      const deletedCar = await Car.findByIdAndDelete(id);
      if (!deletedCar) {
        return new ResponseHandler(res, 404, false, "Car not found");
      }
      return new ResponseHandler(res, 200, true, "Car deleted successfully");
    } catch (error) {
      return new ResponseHandler(res, 500, false, error.message);
    }
  } else {
    return new ResponseHandler(
      res,
      403,
      false,
      "Unauthorized. Only admin users can create cars."
    );
  }
};

exports.singleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return new ResponseHandler(res, 400, true, "image not uploaded");
    }
    // const images = req.files.map((file) => file.path);
    const image = req.file.path;
    return new ResponseHandler(
      res,
      200,
      true,
      "image uploaded successfully",
      image
    );
  } catch (error) {
    return new ResponseHandler(res, 500, false, error.message);
  }
};

exports.multiUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return new ResponseHandler(res, 400, false, "No images uploaded");
    }
    const images = req.files.map((file) => file.path);
    return new ResponseHandler(
      res,
      200,
      true,
      "Images uploaded successfully",
      images
    );
  } catch (error) {
    console.error("Error in multiUpload:", error);
    return new ResponseHandler(res, 500, false, "Internal server error");
  }
};
