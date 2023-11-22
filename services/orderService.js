const Order = require("../models/orderModel");
const Car = require("../models/carModel");
const User = require("../models/user");
// create order
async function createOrder({
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
      cvc
})
{
    try{

        const user = await User.findOne({ _id: userId });
        const car = await Car.findOne({ _id: carId });

        if (!user && !car){
            throw new Error("User and Car not found")
        }
        const existingOrder = await Order.findOne({ user: userId, car: carId, status: { $in: ['accepted', 'rented'] }});
        if (existingOrder) {
            throw new Error("Car is already rented by you");
          }
          const pickupDateTime = new Date(`${pickupDate} ${pickupTime}`);
          const dropOffDateTime = new Date(`${dropOffDate} ${dropOffTime}`);
      
          const timeDifference = Math.abs(dropOffDateTime.getTime() - pickupDateTime.getTime());
          const totalDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
          const totalPrice = totalDays * car.price;
          console.log(totalPrice);
          
          console.log(typeof totalPrice);
          

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
            totalPrice: totalPrice,
          });
          return newOrderInfo
      
    }
    catch(error){
        throw new Error(error.message);
    }
}

// get order
async function getOrder(){
  try{
    const newOrderInfo = await Order.find();
    if (newOrderInfo.length === 0){
      throw new Error("No Order info found")
    }
    return newOrderInfo
  }
  catch(error){
    throw new Error(error.message);
  }
}
// update status
async function updateStatus(orderId, {status}){
  try{
    const order = await Order.findByIdAndUpdate(orderId, {status}) 
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  }
  catch(error){
    throw new Error(error.message)
  }

}

module.exports= {
  createOrder,
  getOrder,
  updateStatus
    
}