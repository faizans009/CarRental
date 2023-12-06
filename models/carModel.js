const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  companyName: {
    type: String,
  },
  image: [
    {
      type: String,
    },
  ],
  carName: {
    type: String,
  },
  carType: {
    type: String,
  },
  fuelCapacity: {
    type: String,
  },
  steering: {
    type: String,
  },
  capacity: {
    type: String,
  },
  make: {
    type: String,
  },
  model: {
    type: Number,
  },
  registrationCity: {
    type: String,
  },
  transmission: {
    type: String,
  },

  rating: {
    type: Number,
    default: 0,
  },
  condition: {
    type: String,
  },
  fuelType: {
    type: String,
  },
  carDesc: {
    type: String,
  },
  price: {
    type: Number,
    requires: true,
  },
  status: {
    type: String,
    enum: ["available", "booked"],
    default: "available",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
Cars = mongoose.model("Car", carSchema);

module.exports = Cars;
