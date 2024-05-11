const ResponseHandler = require("../utils/responseHandler");
const User = require("../models/user");
const Profile = require("../models/profileModel");
// create profile
exports.createProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return new ResponseHandler(res, 404, false, "User not found");
    }
    const profile = await Profile.findOne({ user: userId });
    if (profile) {
      return new ResponseHandler(res, 404, false, "Profile not found");
    }
    const newProfile = await Profile.create({
      user: userId,
      profileImage: req.body.profileImage,
      fullName: req.body.fullName,
      mobile: req.body.mobile,
      email: req.body.email,
      gender: req.body.gender,
      postcode: req.body.postcode,
      address: req.body.address,
      city: req.body.city,
      licenseNo: req.body.licenseNo,
      frontImage: req.body.frontImage,
      backImage: req.body.backImage,
    });
    return new ResponseHandler(
      res,
      200,
      true,
      "Category created successfully",
      newProfile
    );
  } catch (error) {
    console.log(error.message);
    return new ResponseHandler(res, 500, false, error.message);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.find();
    if (profile.length === 0) {
      return new ResponseHandler(res, 404, false, "No license profile found");
    }
    return new ResponseHandler(res, 200, true, "Get profile", profile);
  } catch (error) {
    return new ResponseHandler(res, 500, false, error.message);
  }
};
// get profile by id
exports.getProfileById = async (req, res) => {
  const { id } = req.params;
  try {
    const profile = await Profile.findById(id);
    if (!profile) {
      return new ResponseHandler(res, 404, false, "Profile not found");
    }
    return new ResponseHandler(res, 200, true, "Profile found", profile);
  } catch (error) {
    return new ResponseHandler(res, 500, false, error.message);
  }
};


//   update data
exports.updateProfile = async (req, res) => {
  const user = req.user.id;
  const updateData = req.body;
  try {
    const profile = await Profile.findOne({ user });
    if (!profile) {
      return new ResponseHandler(res, 404, false, "Profile not found");
    }

    
    const updatedProfile = await await Profile.findByIdAndUpdate(
      profile._id,
      updateData,
      { new: true }
    );
    if (!updatedProfile) {
      return new ResponseHandler(res, 404, false, "license Profile not found");
    }
    return new ResponseHandler(
      res,
      200,
      true,
      "profile updated",
      updatedProfile
    );
  } catch (error) {
    console.log(error.message);
    return new ResponseHandler(res, 500, false, error.message);
  }
};


// delete profile by id
exports.deleteProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const profile = await Profile.findOne({ user: id });
    if (!profile) {
      return new ResponseHandler(res, 404, false, "Profile not found");
    }
    await Profile.deleteOne({ _id: profile._id });
    return new ResponseHandler(
      res,
      200,
      true,
      "license profile deleted successfully"
    );
  } catch (error) {
    return new ResponseHandler(res, 500, false, error.message);
  }
};