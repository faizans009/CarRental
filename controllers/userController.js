const User = require("../models/user");
const userService = require("../services/userService");
const generateToken = require("../middlewares/jwt");
const ResponseHandler = require("../utils/responseHandler");
const { generateOTP } = require("./OTPGenerate");
const { sendEmail } = require("./emailController");

exports.signUp = async (req, res) => {
  const { username, email, password, mobile, admin } = req.body;
  console.log(req.body);
  
  try {
    const newUser = await userService.signUp({
      username,
      email,
      password,
      mobile,
    });
    // otp = generateOTP();
    otp = '123456';
    sendEmail(email, otp);
    newUser.otp.value = otp;
    newUser.otp.createdAt = new Date(Date.now());
    newUser.otp.expiresAt = new Date(
      newUser.otp.createdAt.getTime() + 5 * 60 * 1000
    );
    await newUser.save();
    return new ResponseHandler(
      res,
      201,
      true,
      "New user created successfully",
      newUser
    );
  } catch (error) {
    return new ResponseHandler(res, 500, false, error.message);
  }
};

exports.getUser = async (req, res) => {
  if (req.user._id && req.user.admin) {
    try {
      const { id } = req.body;
      const user = await userService.getUser(id);

      return new ResponseHandler(res, 200, true, "Get User Successfully", user);
    } catch (error) {
      return new ResponseHandler(res, 500, false, error.message);
    }
  } else {
    return new ResponseHandler(res, 403, false, "Unauthorized. Only admin can get users");
   
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.signIn(res, email, password);
    if (user.error) {
      return new ResponseHandler(res, 500, false, "Internal server error: " + user.error);
    }
     
    if (user.status === 404) {
      return new ResponseHandler(res, 404, false, user.message);
    }

    if (user.status === 400) {
      return new ResponseHandler(res, 400, false, user.message);
    }
  
    if (user.emailVerified === false) {
      // const otp = generateOTP();
      const otp = 123456;
      sendEmail(email, otp);
      const value = otp;
      const createdAt = new Date(Date.now());
      const expiresAt = new Date(createdAt.getTime() + 5 * 60 * 1000);
      user.otp = { value, createdAt, expiresAt };
      await user.save()
      console.log(user.otp);
      
      // await User.findByIdAndUpdate(user._id, { otp });
      return new ResponseHandler(
        res,
        400,
        false,
        "plz verify your account first"
      );
    }

    const token = generateToken(res, user);
    return new ResponseHandler(res, 201, true, "Sign in Successfully", {
      user,
      token,
    });
  } catch (error) {
    return new ResponseHandler(res, 500, false, "Internal server error");
  }
};
exports.validateOTP = async (req, res) => {
  const {enteredOTP,email } = req.body;
  try {
    const validate = await userService.validateOTP({ res, enteredOTP ,email});
    if (validate.success) {
      return new ResponseHandler(
        res,
        validate.status,
        validate.success,
        validate.message,
        validate.data
      );
    } else {
      return new ResponseHandler(
        res,
        validate.status,
        validate.success,
        validate.message
      );
    }
  } catch (error) {
    return new ResponseHandler(res, 500, false, error.message);
  }
};
// forgot password
exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userService.forgetPassword({email});
    if (!user) { 
      return new ResponseHandler(res, 404, false, "User not found");
    }
    // const otp = generateOTP();
    const otp = 123456;
    sendEmail(email, otp);

    const createdAt = new Date(Date.now());
    const expiresAt = new Date(createdAt.getTime() + 5 * 60 * 1000);
    user.otp = { value: otp, createdAt, expiresAt };
    await user.save(); 

    return new ResponseHandler(res, 200, true, "OTP sent to your email",{email});
  } catch (error) {
    return new ResponseHandler(res, 500, false, error.message);
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  try {
    const user = await userService.resetPassword({
      email,
      newPassword,
      confirmPassword,
    });
    if (!user) { 
      return new ResponseHandler(res, 404, false, "User not found");
    }
    if (newPassword !== confirmPassword) {
      return new ResponseHandler(res, 400, false, "Password and confirm password do not match");
    }
    return new ResponseHandler(res, 200, true, "Password reset successfully");
  } catch (error) {
    return new ResponseHandler(res, 500, false, error.message);
  }
};

exports.profile = async (req, res) => {
  try {
    const id = req.params.id;

    const updateData = req.body;
    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    const updatedProfile = await userService.profile({ req, id, updateData });

    return new ResponseHandler(
      res,
      200,
      true,
      "Profile updated",
      updatedProfile
    );
  } catch (error) {
    return new ResponseHandler(res, 500, false, error.message);
  }
};
