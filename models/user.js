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
    type: Number
  },
  gender: {
    type: String
  },
  postcode: {
    type: Number
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
