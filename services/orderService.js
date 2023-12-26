const Order = require("../models/orderModel");
const Car = require("../models/carModel");
const User = require("../models/user");
// create order
// async function createOrder({
//     userId,
//       carId,
//       Name,
//       PhoneNo,
//       Address,
//       Town,
//       pickupLocation,
//       pickupDate,
//       pickupTime,
//       dropOffLocation,
//       dropOffDate,
//       dropOffTime,
//       cardNo,
//       ExpDate,
//       cardHolder,
//       cvc
// })
// {
//     try{
//         const user = await User.findOne({ _id: userId });
//         const car = await Car.findOne({ _id: carId });

//         if (!user && !car){
//             throw new Error("User and Car not found")
//         }
//         const existingOrder = await Car.findOne({ status: { $in: ['booked'] }});
//         if (existingOrder) {
//             throw new Error("Car is already booked");
//           }
//           const pickupDateTime = new Date(`${pickupDate} ${pickupTime}`);
//           const dropOffDateTime = new Date(`${dropOffDate} ${dropOffTime}`);
      
//           const timeDifference = Math.abs(dropOffDateTime.getTime() - pickupDateTime.getTime());
//           const totalDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
//           const totalPrice = totalDays * car.price;
          
          

//           const newOrderInfo = await Order.create({
//             user: userId,
//             car: carId,
//             Name: Name,
//             PhoneNo: PhoneNo,
//             Address: Address,
//             Town: Town,
//             Pickup: {
//               location: pickupLocation,
//               date: pickupDate,
//               time: pickupTime,
//             },
//             DropOff: {
//               location: dropOffLocation,
//               date: dropOffDate,
//               time: dropOffTime,
//             },
//             cardNo: cardNo,
//             ExpDate: ExpDate,
//             cardHolder: cardHolder,
//             cvc: cvc,
//             price: car.price,
//             totalDays: totalDays,
//             totalPrice: totalPrice,
//           });
//           await Car.updateOne(
//             { _id: carId },
//             { $set: { status: 'booked' } }
//         );

//         return newOrderInfo;
      
//     }
//     catch(error){
//         throw new Error(error.message);
//     }
// }

// get order
// async function getOrder(){
//   try{
//     const newOrderInfo = await Order.find();
//     if (newOrderInfo.length === 0){
//       throw new Error("No Order info found")
//     }
//     return newOrderInfo
//   }
//   catch(error){
//     throw new Error(error.message);
//   }
// }
// // update status
// async function updateStatus(carId, {status}){
//   try{
//     const car = await Car.findByIdAndUpdate(carId, {status}) 
//     if (!car) {
//       throw new Error("car not found");
//     }
//     return car;
//   }
//   catch(error){
//     throw new Error(error.message)
//   }
// }
// module.exports= {
//   // createOrder,
//   getOrder,
//   updateStatus
    
// }
    