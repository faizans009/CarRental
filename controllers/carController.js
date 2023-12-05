const carService = require('../services/carService')
const ResponseHandler = require("../utils/responseHandler")
const fs = require("fs");
// create cars
exports.createCar = async (req, res) => {
  if (req.user._id && req.user.admin){
    try {
      
        const images = req.files.map((file) => file.path);
        const newCar = await carService.createCar({
          ...req.body,
          images,
        });
        return new ResponseHandler(res, 200,true,"Car created successfully",newCar )
      
    } catch (error) {
      return new ResponseHandler(res, 500,false,error.message)
  } 
}
else{
  return new ResponseHandler(res, 403, false, "Unauthorized. Only admin users can create cars.");
}
};

// // get all cars
exports.getAllCars = async (req, res) => {
  try {
    const cars = await carService.getAllCars()
    if (cars.length === 0) {
      return new ResponseHandler(res, 404,false,"No cars found")
    }
    return new ResponseHandler(res, 200,true,"Car found",cars)
  } catch (error) {
    return new ResponseHandler(res, 500,false,error.message)
  }
};

// get one car
exports.getOneCar = async (req, res) => {
  const { id } = req.params;
  try {
    const car = await carService.getOneCar(id);

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
  
  if (req.user._id && req.user.admin){ 
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    if (req.files) {
      updateData.image =  req.files.map((file) => file.path);
    }
    const updatedCar = await carService.updateCar(id, updateData);
    if (!updatedCar) {
      return new ResponseHandler(res, 404,false,"Car not found")
    }

    return new ResponseHandler(res, 200,true,"Car Updated",updatedCar)
  
  } catch (error) {
    return new ResponseHandler(res, 500,false,error.message)
  }
}
else{
  return new ResponseHandler(res, 403, false, "Unauthorized. Only admin users can update car");
}
};


// delete car
exports.deleteCar = async (req, res) => {
  if (req.user._id && req.user.admin){
  try {
     
    const { id } = req.params;
    
    await carService.deleteCar(id);
    return new ResponseHandler(res, 200,true,"Car deleted successfully")
  
} catch (error) {
    return new ResponseHandler(res, 500,false,error.message)
  }
}
else{
  return new ResponseHandler(res, 403, false, "Unauthorized. Only admin users can delete car");
}
};
