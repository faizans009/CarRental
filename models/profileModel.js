const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullName: {
    type: String,
  },
  mobile: {
    type: String,
  },
  email: { 
    type: String,
  },
  gender: {
    type: String,
  },
  postcode: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  licenseNo: {
    type: String,
  },
  frontImage: {
    type: String,
  },
  backImage: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
