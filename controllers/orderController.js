const Order = require("../models/orderModel");
const Car = require("../models/carModel");
const User = require("../models/user");
const ResponseHandler = require("../utils/responseHandler") 

exports.createOrder = async (req, res) => {
  try {
    const {
      userId,
      carId,
      Name,
      PhoneNo,
      Address,
      Town,
      pickupLocation,
      pickupDate,
      pickupTime,
      dropOffLocation,
      dropOffDate,
      dropOffTime,
      cardNo,
      ExpDate,
      cardHolder,
      cvc,
    } = req.body;
    const user = await User.findOne({ _id: userId });
    const car = await Car.findOne({ _id: carId });

    if (!user && !car) {
      return new ResponseHandler(res, 404,false,"User and Car not found" )
    }
    const existingOrder = await Order.findOne({ user: userId, car: carId , status: { $in: ['accepted', 'rented'] }});

    if (existingOrder) {
      return new ResponseHandler(res, 400,false,{ error: "Car is already rented by u" } )
    }

    const pickupDateTime = new Date(
        `${pickupDate} ${pickupTime}`
      );
      const dropOffDateTime = new Date(
        `${dropOffDate} ${dropOffTime}`
      );
  
      const timeDifference = Math.abs(
        dropOffDateTime.getTime() - pickupDateTime.getTime()
      );
  
      const totalDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
  
      const totalPrice = totalDays * car.price;
  

    const newOrderInfo = await Order.create({
      user: userId,
      car: carId,
      Name: Name,
      PhoneNo: PhoneNo,
      Address: Address,
      Town: Town,
      Pickup: {
        location: pickupLocation,
        date: pickupDate,
        time: pickupTime,
      },
      DropOff: {
        location: dropOffLocation,
        date: dropOffDate,
        time: dropOffTime,
      },
      cardNo: cardNo,
      ExpDate: ExpDate,
      cardHolder: cardHolder,
      cvc: cvc,
      price: car.price,
      totalDays: totalDays,
      totalPrice:totalPrice
    });
    return new ResponseHandler(res, 200,true,"Car rented successfully",newOrderInfo )
  } catch (error) {
    return new ResponseHandler(res, 500,false,error.message )
  }
};


exports.getOrder = async (req, res) => {
  const isAdmin = req.user._id && req.user.admin;
  if (!isAdmin) {
    return new ResponseHandler(res, 403,false,"Unauthorized: Only admin can access Order information" )
    
  }
  try {
    const newOrderInfo = await Order.find();
    if (newOrderInfo.length === 0) {
      return new ResponseHandler(res, 404,false,"No Order info found" )
    }
    return new ResponseHandler(res, 200,true,"Get order successfully",newOrderInfo )
  } catch (error) {
    return new ResponseHandler(res, 500,false,error.message )
  }
};

exports.updateStatus = async (req,res) => {
    try{
        const {orderId, status} = req.body;
        const order = await Order.findByIdAndUpdate(orderId, {status}) 
        if (!order){
          return new ResponseHandler(res, 404,false,"Order not found" )
        }
        return new ResponseHandler(res, 200,true,"status Updated" )
        
    }
    catch(error){
      return new ResponseHandler(res, 500,false,error.message )
    }
}
