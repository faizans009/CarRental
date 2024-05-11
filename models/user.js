const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String
  },
  mobile: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  // admin: {
  //   type:Boolean,
  //   default:false
  // },
  role: {
    type: String,
    enum: ["user", "superAdmin","admin"],
    default: 'user'
  },
  otp: {
    value: {
      type: Number,
      default: null,
    },
    createdAt : {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  favouriteCar: [{
    car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    }
}],
date: {
    type: Date,
    default: Date.now,
  },
});




User = mongoose.model('User', userSchema);

module.exports = User;
