const Review = require("../models/reviewModel");
const Car = require("../models/carModel");
const User = require("../models/user");
async function createReview(userId, review, rating, carId) {
    const user = await User.findOne({_id: userId})
    const car = await Car.findOne({ _id: carId });

    if (!user) {
        throw new Error("User not found" );
      }
    if (!car) {
      throw new Error("Car not found" );
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
return newReview;

}

async function getReviews(){
    const reviews = await Review.find()
      if (reviews.length === 0) {
        throw new Error("No reviews found");
      }
      return reviews
}
module.exports = {
    createReview,
    getReviews,
}