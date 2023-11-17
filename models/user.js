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
  admin: {
    type:Boolean,
    default:false
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
  gender: {
    type: String
  },
  postcode: {
    type: Number
  },
  profileImage: {
    type: String,
  },
  address: {
    type: String
  },
  city:{
    type: String
  },
  favouriteCar: [{
    car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    }
}],
});




User = mongoose.model('User', userSchema);

module.exports = User;
