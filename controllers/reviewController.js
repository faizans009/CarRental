const Review = require("../models/reviewModel");
const Car = require("../models/carModel");
const User = require("../models/user");
const ResponseHandler = require("../utils/responseHandler")
// create review
exports.createReview = async (req, res) => {
  try {
    const {userId, review, rating, carId } = req.body;
    const user = await User.findOne({_id: userId})
    const car = await Car.findOne({ _id: carId });

    if (!user && !car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const newReview = await Review.create({
      user: userId,
      car: carId,
      rating: rating,
      review: review,
    });
    car.reviews.push(newReview);
    let avg = 0;
    car.reviews.forEach((rev) => {
       avg += rev.rating;
   })
   car.rating = avg / car.reviews.length;
   await car.save({
       validateBeforeSave: false
   })
    // await car.save();
    return new ResponseHandler(res, 200,true,"Review deleted successfully",newReview)
   
  } catch (error) {
    return new ResponseHandler(res, 500,false,error.message)
  }
};

// get review
exports.getReview = async (req,res) => {
    try{
      const reviews = await Review.find()
      if (reviews.length === 0) {
        return new ResponseHandler(res, 400,false,"No reviews found")
    }
    return new ResponseHandler(res, 200,true,"Reviews get successfully",reviews)
    
}
catch(error){
  return new ResponseHandler(res, 500,false,error.message)
}
    }
