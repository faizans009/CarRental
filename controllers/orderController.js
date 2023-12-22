const orderService = require("../services/orderService");
const ResponseHandler = require("../utils/responseHandler");
const Order = require("../models/orderModel");
const Car = require("../models/carModel");
const User = require("../models/user");
const mongoose = require("mongoose");
exports.createOrder = async (req, res) => {
  try {
    const {
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
    const userId=req.user.id
    console.log(userId);
    
    const user = await User.findOne({ _id: userId });
    const car = await Car.findOne({ _id: carId });

    if (!user) {
      return new ResponseHandler(
        res,
        404,
        false,
        "user not found"
      );
    }
    if (!car) {
      return new ResponseHandler(
        res,
        404,
        false,
        "Car not found"
      );
    }

    const existingOrder = await Order.aggregate([
      {
        $match: {
          car: new mongoose.Types.ObjectId(carId),
          status: "booked",
          $or: [
            {
              $and: [
                { "Pickup.date": { $lte: pickupDate } },
                { "DropOff.date": { $gte: pickupDate } },
              ],
            },
            {
              $and: [
                { "Pickup.date": { $lte: dropOffDate } },
                { "DropOff.date": { $gte: pickupDate } },
              ],
            },
            {
              $and: [
                { "Pickup.date": { $lte: dropOffDate } },
                { "DropOff.date": { $gte: pickupDate } },
              ],
            },
          ],
        },
      },
    ]);
    if (existingOrder.length > 0) {
      return new ResponseHandler(
        res,
        400,
        false,
        "Car is already booked for the selected dates and times"
      );
    }

    const pickupDateTime = new Date(`${pickupDate} ${pickupTime}`);
    const dropOffDateTime = new Date(`${dropOffDate} ${dropOffTime}`);
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
      totalPrice: totalPrice,
    });

    // Update the car status to 'booked'
    await Order.updateOne({ _id: newOrderInfo }, { $set: { status: "booked" } });

    return new ResponseHandler(
      res,
      200,
      true,
      "Car rented successfully",
      newOrderInfo
    );
  } catch (error) {
    console.log(error.message);
    return new ResponseHandler(res, 500, false, error.message);
  }
};

exports.getOrder = async (req, res) => {
  try {
    const isAdmin = req.user._id && req.user.admin;
    if (!isAdmin) {
      return new ResponseHandler(
        res,
        403,
        false,
        "Unauthorized: Only admin can access Order information"
      );
    }
    const newOrderInfo = await orderService.getOrder();

    return new ResponseHandler(
      res,
      200,
      true,
      "Get order successfully",
      newOrderInfo
    );
  } catch (error) {
    return new ResponseHandler(res, 500, false, error.message);
  }
};

exports.updateStatus = async (req, res) => {
  if (req.user._id && req.user.admin) {
    try {
      const { carId, status } = req.body;
      const newOrder = await orderService.updateStatus(carId, { status });

      return new ResponseHandler(res, 200, true, "status Updated", newOrder);
    } catch (error) {
      return new ResponseHandler(res, 500, false, error.message);
    }
  } else {
    return new ResponseHandler(
      res,
      403,
      false,
      "Unauthorized. Only admin users can create cars."
    );
  }
};
