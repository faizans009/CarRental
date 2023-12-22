const profileService = require("../services/profileServices");
const ResponseHandler = require("../utils/responseHandler");
const fs = require("fs");
// create profile
exports.createProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileImage = req.files["profileImage"][0].path;
    const frontImage = req.files["frontImage"][0].path;
    const backImage = req.files["backImage"][0].path;
    const newProfile = await profileService.createProfile({
      userId,
      data: req.body,
      profileImage: profileImage,
      frontImage: frontImage,
      backImage: backImage,
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
    const profile = await profileService.getProfile();
    if (profile.length === 0) {
      return new ResponseHandler(res, 404, false, "No license profile found");
    }
    return new ResponseHandler(res, 200, true, "Get profile", profile);
  } catch (error) {
    return new ResponseHandler(res, 500, false, error.message);
  }
};

//   update data
exports.updateProfile = async (req, res) => {
  const user = req.user.id;
  const updateData = req.body;
  try {
    if (req.files) {
      updateData.ProfileImage = req.files.path;
      updateData.frontImage = req.files.path;
      updateData.backImage = req.files.path;
    }
    const updatedProfile = await profileService.updateProfile(
      user,
      updateData,
      req.files
    );

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

// delete data
exports.deleteProfile = async (req, res) => {
  const { id } = req.params;
  try {
    await profileService.deleteProfile(id);
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
