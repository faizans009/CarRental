const orderService = require('../services/orderService')
const ResponseHandler = require("../utils/responseHandler") 
const Order = require("../models/orderModel");
const Car = require("../models/carModel");
const User = require("../models/user");
exports.createOrder = async (req, res) => {
  try {
   
    const orderDetails = req.body;
    // const order = await orderService.createOrder(orderDetails);
    const existingOrder = await orderService.aggregate([
      {
        $match: {
          car: mongoose.Types.ObjectId(orderDetails.carId),
          status: 'booked',
          // $or: [
          //   {
          //     $and: [
          //       { "Pickup.date": { $lte: new Date(orderDetails.dropOffDate) } },
          //       { "DropOff.date": { $gte: new Date(orderDetails.pickupDate) } },
          //     ],
          //   },
          //   {
          //     $and: [
          //       { "Pickup.date": { $lte: new Date(orderDetails.pickupDate) } },
          //       { "DropOff.date": { $gte: new Date(orderDetails.dropOffDate) } },
          //     ],
          //   },
          //   {
          //     $and: [
          //       { "Pickup.date": { $lte: new Date(orderDetails.dropOffDate) } },
          //       { "DropOff.date": { $gte: new Date(orderDetails.dropOffDate) } },
          //     ],
          //   },
          // ],
          $or: [
            {
              $and: [
                { "Pickup.date": { $lt: pickupDate } },
                { "DropOff.date": { $lte: pickupDate } }
              ]
            },
            {
              $and: [
                { "Pickup.date": { $gte: dropOffDate } },
                { "DropOff.date": { $gt: dropOffDate } }
              ]
            }
          ]
        },
      },
    ])
    if (existingOrder.length > 0) {
      return new ResponseHandler(res, 400, false, "Car is already booked for the selected dates and times");
    }

    return new ResponseHandler(res, 200,true,"Car rented successfully",order )
  } catch (error) {
    return new ResponseHandler(res, 500,false,error.message )
  }
};


exports.getOrder = async (req, res) => {
  try {
    const isAdmin = req.user._id && req.user.admin;
    if (!isAdmin) {
      return new ResponseHandler(res, 403,false,"Unauthorized: Only admin can access Order information" )
    }
    const newOrderInfo = await orderService.getOrder();
     
    return new ResponseHandler(res, 200,true,"Get order successfully",newOrderInfo )
  } catch (error) {
    return new ResponseHandler(res, 500,false,error.message )
  }
};

exports.updateStatus = async (req,res) => {
  if (req.user._id && req.user.admin){
     try{
      
        const {carId, status} = req.body;
        const newOrder = await orderService.updateStatus(carId, {status}) 
        
        return new ResponseHandler(res, 200,true,"status Updated",newOrder )
        
    }
    catch(error){
      return new ResponseHandler(res, 500,false,error.message )
    } 
    
  }
  else{
    return new ResponseHandler(res, 403, false, "Unauthorized. Only admin users can create cars.");
  }
}
