const Review = require("../models/reviewModel");
const Car = require("../models/carModel");
const User = require("../models/user");

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

    return res
      .status(200)
      .json({ message: "Review created successfully", newReview });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ message: "something went wrong", error: error.message });
  }
};

// get review
exports.getReview = async (req,res) => {
    try{
      const reviews = await Review.find()
      if (reviews.length === 0) {
        return res.status(404).json({ message: "No reviews found" });
    }

    return res.status(200).json({reviews:reviews});
    
}
catch(error){
    return res.status(500).json({message: "unable to get reviews",error: error.message})
}
    }
