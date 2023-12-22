const Profile = require("../models/profileModel");
const fs = require("fs");
const User = require("../models/user");
// create profile
async function createProfile({
  userId,
  data,
  profileImage,
  frontImage,
  backImage,
}) {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    const profile = await Profile.findOne({ user: userId });
    if (profile) {
      throw new Error("Profile already exist");
    }
    const newProfile = await Profile.create({
      user: userId,
      profileImage: profileImage,
      fullName: data.fullName,
      mobile: data.mobile,
      email: data.email,
      gender: data.gender,
      postcode: data.postcode,
      address: data.address,
      city: data.city,
      licenseNo: data.licenseNo,
      frontImage: frontImage,
      backImage: backImage,
    });
    return newProfile;
  } catch (error) {
    throw new Error(error.message);
  }
}
// get Profile
async function getProfile() {
  try {
    const profile = await Profile.find();
    return profile;
  } catch (error) {
    throw new Error(error.message);
  }
}

// update Profile
async function updateProfile(user, updateData, files) {
  try {
    const profile = await Profile.findOne({ user });
    if (!profile) {
      throw new Error("user Profile not found");
    }
    if (
      files &&
      profile.ProfileImage &&
      profile.frontImage &&
      profile.backImage
    ) {
      await fs.unlinkSync(profile.ProfileImage);
      await fs.unlinkSync(profile.frontImage);
      await fs.unlinkSync(profile.backImage);
    }
    const updatedProfile = await Profile.findByIdAndUpdate(
      profile._id,
      updateData,
      { new: true }
    );
    if (!updatedProfile) {
      throw new Error("License Profile not found");
    }
    return updatedProfile;
  } catch (error) {
    throw new Error(error.message);
  }
}
async function deleteProfile(userId) {
  try {
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      throw new Error("Profile not found");
    }
    await Profile.deleteOne({ _id: profile._id });
  } catch (error) {
    throw new Error(error.message);
  }
}
module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
};
