const Order = require("../models/orderModel");
const Car = require("../models/carModel");
const User = require("../models/user");
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
      return res.status(404).json({ message: "User and Car not found" });
    }
    const existingOrder = await Order.findOne({ user: userId, car: carId , status: { $in: ['accepted', 'rented'] }});

    if (existingOrder) {
      return res.status(400).json({ error: "Car is already rented by u" });
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
    return res.status(200).json({ message: "Success", newOrderInfo });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};


exports.getOrder = async (req, res) => {
  const isAdmin = req.user._id && req.user.admin;
  if (!isAdmin) {
    return res.status(403).json({
      message: "Unauthorized: Only admin can access Order information.",
    });
  }
  try {
    const newOrderInfo = await Order.find();
    if (newOrderInfo.length === 0) {
      return res.status(404).json({ message: "No Order info found" });
    }
    return res.status(200).json({ message: "Success", newOrderInfo });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

exports.updateStatus = async (req,res) => {
    try{
        const {orderId, status} = req.body;
        const order = await Order.findByIdAndUpdate(orderId, {status}) 
        if (!order){
            return res.status(404).json({message: "Order not found"})
        }
        return res.status(200).json({
            success:true,
            message: "status Updated"
        })
    }
    catch(error){
        return res.status(500).json({success:false,message: "Something went wrong",error: error.message })
    }
}
