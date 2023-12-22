const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  PhoneNo: {
    type: Number,
    required: true,
  },
  Address: {
    type: String,
    required: true,
  },
  Town: {
    type: String,
    required: true,
  },
  Pickup: {
    location: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  DropOff: {
    location: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  cardNo: {
    type: Number,
    required: true,
  },
  ExpDate: {
    type: Date,
    required: true,
  },
  cardHolder: {
    type: String,
    required: true,
  },
  cvc: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  totalDays: {
    type: Number,
  },
  totalPrice: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["booked", "cancel","available"],
    default: "available",
  },
});
Order = mongoose.model("Order", orderSchema);
module.exports = Order;
