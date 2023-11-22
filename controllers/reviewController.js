const reviewService = require("../services/reviewService");
const ResponseHandler = require("../utils/responseHandler")
// create review
exports.createReview = async (req, res) => {
  try {
    const {userId, review, rating, carId } = req.body;
    
    const newReview = await reviewService.createReview(userId, review, rating, carId)
    
    return new ResponseHandler(res, 200,true,"Review deleted successfully",newReview)
   
  } catch (error) {
    return new ResponseHandler(res, 500,false,error.message)
  }
};

// get review
exports.getReview = async (req,res) => {
    try{
      const reviews = await reviewService.getReviews()
      
    return new ResponseHandler(res, 200,true,"Reviews get successfully",reviews)
    
}
catch(error){
  return new ResponseHandler(res, 500,false,error.message)
}
    }
