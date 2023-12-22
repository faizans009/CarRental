const User = require("../models/user");
const generateToken = require("../middlewares/jwt");
const ResponseHandler = require("../utils/responseHandler");
const bcrypt = require("bcrypt");
const { generateOTP } = require("./OTPGenerate");
const { sendEmail } = require("./emailController");
exports.signUp = async (req, res) => {
  const { username, email, password, mobile, role } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });  
    if (existingUser) {
      return new ResponseHandler(res, 409, true, "User already exists");
    }
    if (!username || !email || !password || !mobile) {
      return new ResponseHandler(res, 400, false, "Please fill all the fields");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      mobile,
      role,
    });
    await newUser.save();

    // otp = generateOTP();
    const otp = "123456";
    sendEmail(email, otp);
    newUser.otp.value = otp;
    newUser.otp.createdAt = new Date();
    newUser.otp.expiresAt = new Date(Date.now() + 25 * 60 * 1000);
    await newUser.save();

    return new ResponseHandler(
      res,
      201,
      true,
      "New user created successfully",
      newUser
    );
  } catch (error) {
    console.error("Error in signUp:", error);
    return new ResponseHandler(res,500,false,"An error occurred while processing your request");
  }
};
// get all users
exports.getAllUsers = async (req, res) => {
  if (
    (req.user._id && req.user.role === "admin") ||
    req.user.role === "superAdmin"
  ) {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return new ResponseHandler(res, 404, false, "No users found");
    }
    return new ResponseHandler(res, 200, true, "Get All Users Successfully", users);
  } catch (error) {
    return new ResponseHandler(res, 500, false, error.message);
  }
} else {
  return new ResponseHandler(
    res,
    403,
    false,
    "Unauthorized. Only admin can get users"
  );
}
};

// get user by id
exports.getUser = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return new ResponseHandler(res, 404, false, "User not found");
    }
    return new ResponseHandler(res, 200, true, "Get User Successfully", user);
  } catch (error) {
    return new ResponseHandler(res, 500, false, error.message);
  }
};


exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if (!user) {
      return new ResponseHandler(res, 404, false, "User not found");
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return new ResponseHandler(res, 400, false, "Wrong password");
    } 
    if (user.emailVerified === false) {
      // const otp = generateOTP();
      const otp = 123456;
      sendEmail(email, otp);
      const value = otp;
      const createdAt = new Date(Date.now());
      const expiresAt = new Date(createdAt.getTime() + 25 * 60 * 1000);
      user.otp = { value, createdAt, expiresAt }; 
      await user.save();
      return new ResponseHandler(
        res,
        401,
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
  const { enteredOTP, email } = req.body;
  try {
    const user = await User.findOne({email});
    if (!user) {
      return new ResponseHandler(res, 404, false, "User not found"); 
    }
    if (user.otp.value !== enteredOTP ) {
      return new ResponseHandler(res, 401, false, "Invalid OTP"); 
    }
    if (user.otp.expiresAt < new Date()) {
      return new ResponseHandler(res, 400, false, "OTP expired"); 
    }
    user.emailVerified=true;
    await user.save();
    const token = generateToken(res, user);
    return new ResponseHandler(res, 200, true, "OTP is valid", { token ,email}); 
  } catch (error) {
    return new ResponseHandler(res, 500, false, error.message);
  }
};
// forgot password


exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return new ResponseHandler(res, 404, false, "User not found");
    }
    // const otp = generateOTP();
    const otp = 123456;
    sendEmail(email, otp);

    const createdAt = new Date(Date.now());
    const expiresAt = new Date(createdAt.getTime() + 25 * 60 * 1000);
    user.otp = { value: otp, createdAt, expiresAt };
    await user.save();

    return new ResponseHandler(res, 200, true, "OTP sent to your email", {email});
  } catch (error) {
    return new ResponseHandler(res, 500, false, error.message);
  }
};

// reset password
// reset password
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });    
    if (!user) {
      return new ResponseHandler(res, 404, false, "User not found");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return new ResponseHandler(res, 200, true, "Password reset successfully");
  } catch (error) {
    return new ResponseHandler(res, 500, false, error.message);
  }
};


// delete user
exports.deleteUser = async (req, res) => {
  if (
        (req.user._id && req.user.role === "admin") ||
        req.user.role === "superAdmin"
      ) {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return new ResponseHandler(res, 404, false, "User not found");
    }
    return new ResponseHandler(res, 200, true, "User deleted successfully");
  } catch (error) {
    return new ResponseHandler(res, 500, false, error.message);
  }
} else {
      return new ResponseHandler(
        res,
        403,
        false,
        "Unauthorized. Only admin can get users"
      );
    }
};
