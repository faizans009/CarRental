const orderService = require("../services/orderService");
const ResponseHandler = require("../utils/responseHandler");
const Order = require("../models/orderModel");
const Car = require("../models/carModel");
const User = require("../models/user");
const mongoose = require("mongoose");
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({ _id: userId });
    const car = await Car.findOne({ _id: req.body.carId });
    if (!user) {
      return new ResponseHandler(res, 404, false, "user not found");
    }
    if (!car) {
      return new ResponseHandler(res, 404, false, "Car not found");
    }

    const existingOrder = await Order.aggregate([
      {
        $match: {
          car: new mongoose.Types.ObjectId(req.body.carId),
          status: "booked",
          $or: [
            {
              $and: [
                { "Pickup.date": { $lte: req.body.pickupDate } },
                { "DropOff.date": { $gte: req.body.pickupDate } },
              ],
            },
            {
              $and: [
                { "Pickup.date": { $lte: req.body.dropOffDate } },
                { "DropOff.date": { $gte: req.body.pickupDate } },
              ],
            },
            {
              $and: [
                { "Pickup.date": { $lte: req.body.dropOffDate } },
                { "DropOff.date": { $gte: req.body.pickupDate } },
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

    const pickupDateTime = new Date(
      `${req.body.pickupDate} ${req.body.pickupTime}`
    );
    const dropOffDateTime = new Date(
      `${req.body.dropOffDate} ${req.body.dropOffTime}`
    );
    const timeDifference = Math.abs(
      dropOffDateTime.getTime() - pickupDateTime.getTime()
    );
    const totalDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
    const totalPrice = totalDays * car.price;

    const newOrderInfo = await Order.create({
      user: userId,
      car: req.body.carId,
      Name: req.body.Name,
      PhoneNo: req.body.PhoneNo,
      Address: req.body.Address,
      Town: req.body.Town,
      Pickup: {
        location: req.body.pickupLocation,
        date: req.body.pickupDate,
        time: req.body.pickupTime,
      },
      DropOff: {
        location: req.body.dropOffLocation,
        date: req.body.dropOffDate,
        time: req.body.dropOffTime,
      },
      cardNo: req.body.cardNo,
      ExpDate: req.body.ExpDate,
      cardHolder: req.body.cardHolder,
      cvc: req.body.cvc,
      price: car.price,
      totalDays: totalDays,
      totalPrice: totalPrice,
    });
    await Order.updateOne(
      { _id: newOrderInfo },
      { $set: { status: "booked" } }
    );

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
  if (
    (req.user._id && req.user.role === "admin") ||
    req.user.role === "superAdmin"
  ) {
    try {
      const { page, limit } = req.query;
      const skipCount = (page - 1) * limit;
      const newOrderInfo = await Order.find()
        .skip(skipCount)
        .limit(limit);
      if (newOrderInfo.length === 0) {
        return new ResponseHandler(res, 404, false, "No Order info found");
      }

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
  } else {
    return new ResponseHandler(
      res,
      403,
      false,
      "Unauthorized. Only admin users can create cars."
    );
  }
};
// update order status
exports.updateStatus = async (req, res) => {
  if (
    (req.user._id && req.user.role === "admin") ||
    req.user.role === "superAdmin"
  ) {
    try {
      const { orderId, status } = req.body;
      const newOrder = await Order.updateOne(
        { _id: orderId },
        { $set: { status: status } }
      );
      return new ResponseHandler(res, 200, true, "status Updated");
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

// exports.updateStatus = async (req, res) => {
//   if (req.user._id && req.user.admin) {
//     try {
//       const { carId, status } = req.body;
//       const newOrder = await Order.updateStatus(carId, { status });

//       return new ResponseHandler(res, 200, true, "status Updated", newOrder);
//     } catch (error) {
//       return new ResponseHandler(res, 500, false, error.message);
//     }
//   } else {
//     return new ResponseHandler(
//       res,
//       403,
//       false,
//       "Unauthorized. Only admin users can create cars."
//     );
//   }
// };
