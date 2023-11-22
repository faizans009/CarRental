const Car = require("../models/carModel");
const fs = require("fs");
async function createCar({
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
    images,
  }) {
    try {
      const newCar = await Car.create({
        companyName,
        image: images,
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
      });
  
      return newCar;
    } catch (error) {
      throw new Error(error.message);
    }
  }

//   get all
async function getAllCars(){
    try{
        const cars = await Car.find();
        return cars;
    }
    catch(error){
      throw new Error(error.message);
    }
}
// get one
async function getOneCar(id){
    try{
        const car = await Car.findById(id);
        
        return car
    }
    catch(error){
      throw new Error(error.message);
    }
}
// update car
async function updateCar(id, updateData) {
    try {
      const car = await Car.findById(id);
  
      if (!car) {
        throw new Error("Car not found");
      }
  
      if (updateData.image && car.image) {
        car.image.forEach((file) => {
          fs.unlinkSync(file);
        });
      }
  
      const updatedCar = await Car.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!updatedCar) {
        throw new Error("Car not found");
      }
  
      return updatedCar;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
  module.exports = {
    updateCar,
  };
 
  


async function deleteCar(id){
    try{
        await Car.findByIdAndRemove(id) 
    }
    catch(error){
      throw new Error(error.message);
    }
}



  module.exports = {
    createCar,
    getAllCars,
    getOneCar,
    updateCar,
    deleteCar,
  }