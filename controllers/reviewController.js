const Review = require("../models/reviewModel");
const Car = require("../models/carModel");
const User = require("../models/user");
const ResponseHandler = require("../utils/responseHandler");
// create review
exports.createReview = async (req, res) => {
  
  try {
    const userId = req.user.id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return new ResponseHandler(res, 404, false, "User not found");
    }
    const car = await Car.findOne({ _id: req.body.carId });
    if (!car) {
      return new ResponseHandler(res, 404, false, "Car not found");
    }
    const reviews = await Review.find({ car: req.body.carId });

    const newReview = await Review.create({
      user: userId,
      car: req.body.carId,
      rating: req.body.rating,
      review: req.body.review,
    });
    if (reviews.length > 0) {
        avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      }
      car.rating = avgRating;
         await car.save({
          validateBeforeSave: false
      })

    return new ResponseHandler(
      res,
      200,
      true,
      "Review created successfully",
      newReview
    );
  } catch (error) {
    return new ResponseHandler(res, 500, false, error.message);
  }
};



// get review
exports.getReview = async (req, res) => {
  try {
    const reviews = await Review.find();
    if (reviews.length === 0) {
      return new ResponseHandler(res, 404, false, "No reviews found");
    }
    return new ResponseHandler(
      res,
      200,
      true,
      "Reviews get successfully",
      reviews
    );
  } catch (error) {
    return new ResponseHandler(res, 500, false, error.message);
  }
};
// update review
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return new ResponseHandler(res, 404, false, "Review not found");
    }
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    return new ResponseHandler(
      res,
      200,
      true,
      "Review updated successfully",
      updatedReview
    );
  } catch (error) {
    return new ResponseHandler(res, 500, false, error.message);
  }
};


// delete reviews
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return new ResponseHandler(res, 404, false, "Review not found");
    }
    // await review.delete();
    return new ResponseHandler(res, 200, true, "Review deleted successfully");
  } catch (error) {
    console.log(error.message);
    return new ResponseHandler(res, 500, false, error.message);
  }
};