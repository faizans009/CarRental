const User = require("../models/user");
const bcrypt = require("bcrypt");
const generateToken = require("../middlewares/jwt");
// signup
async function signUp({ username, email, password, mobile, admin }) {
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      throw new Error("User already exists");
    } 
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      mobile,
      admin,
    });
    return newUser;

  } catch (error) {
    throw new Error(error.message);
  }
}
// get user
async function getUser(id) {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}
// sign in
async function signIn(res, email, password) {
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new Error("User not found");
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    
    
    if (!matchPassword) {
      throw new Error("Wrong password");
    }
    return  existingUser ;
  } catch (error) {
    return { error: error.message };
  }
}
// validate otp
async function validateOTP({ res, email, enteredOTP }) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const parsedEnteredOTP = parseInt(enteredOTP, 10);
    if (isNaN(parsedEnteredOTP)) {
      throw new Error("Invalid OTP format");
    }
    if (user.otp.value !== parsedEnteredOTP) {
      throw new Error("Invalid OTP");
    }
    if (user.otp.expiresAt < new Date()) {
      throw new Error("OTP expired");
    }
    user.emailVerified=true;
    await user.save();
    const token = generateToken(res, user);
    return {
      status: 200,
      success: true,
      message: "OTP is valid",
      data: { token },
    };
  } catch (error) {
    throw new Error(error.message);
  }
}
// reset password
async function resetPassword({ email,otp, newPassword, confirmPassword }) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    if (newPassword !== confirmPassword) {
      throw new Error("Password and confirm password do not match");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return { status: 200, success: true, message: "Password reset successful" };
  } catch (error) {
    throw new Error(error.message);
  }
}
// profile
async function profile({req,id, updateData}){
    try{
        const existingUser = await User.findOne({ _id: id });
        if (!existingUser) {
            throw new Error("User not found");
          }
          if (updateData.profileImage) {
            updateData.profileImage = req.file.path;
          }
          const updatedProfile = await User.findByIdAndUpdate(id, updateData, { new: true });

          if (!updatedProfile) {
            throw new Error("User not found");
          }
    
          return updatedProfile;
    }
    catch(error){
        throw new Error(error.message);
    }
}


module.exports = {
  signUp,
  getUser,
  signIn,
  validateOTP,
  resetPassword,
  profile
};
