const User = require("../models/user");
const userService = require('../services/userService')
const generateToken = require("../middlewares/jwt");
const ResponseHandler = require("../utils/responseHandler")
const { generateOTP } = require("./OTPGenerate");
const { sendEmail } = require("./emailController");

exports.signUp = async (req, res) => {
  const { username, email, password, mobile,admin } = req.body;
  try {
    const newUser = await userService.signUp({
      username,
      email,
      password,
      mobile
    });
    otp = generateOTP();
   sendEmail(email, otp);
    // const token = generateToken(res,newUser);
   newUser.otp.value=otp
  //  user.otp.value = otp;
  newUser.otp.createdAt = new Date(Date.now())
  newUser.otp.expiresAt = new Date(newUser.otp.createdAt.getTime() + 60 * 1000);
    // await user.save();
    // newUser.token = token;
    await newUser.save();
    return new ResponseHandler(res, 201,true,"New user created successfully",newUser )
   
  } catch (error) {
    return new ResponseHandler(res, 500,false,error.message )
  }
};

exports.getUser = async(req,res) => {
  if (req.user._id && req.user.admin){
    try{
        const {id} = req.body;
        const user = await userService.getUser(id);
       
        return new ResponseHandler(res, 200,true,"Get User Successfully",user )
    } 
    catch (error) {
      return new ResponseHandler(res, 500,false,error.message )
    }
  }else {
    return res
      .status(403)
      .json({ message: "Unauthorized. Only admin users can create cars." });
  }
};


exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.signIn(res, email, password )
    if(user.emailVerified===false){
      const otp = generateOTP();
      sendEmail(email,otp)
      const value=otp
      const createdAt = new Date(Date.now())
      const expiresAt = new Date(createdAt.getTime() + 60 * 1000);
      const Otp={value,createdAt,expiresAt}
      
      await User.findByIdAndUpdate(user._id, { Otp});
      return new ResponseHandler(res, 400, false, "plz verify your account first");
    }

    const token = generateToken(res, user);
    return new ResponseHandler(res, 201, true, "Sign in Successfully", { user, token });
  } catch (error) {
    return new ResponseHandler(res, 500, false,"Internal server error");
  }
};
exports.validateOTP = async (req, res) => {
  const { email, enteredOTP } = req.body;
  try {
    const validate = await userService.validateOTP({ res,email,enteredOTP });
    if (validate.success) {
      return new ResponseHandler(res, validate.status, validate.success, validate.message, validate.data);
    } else {
      return new ResponseHandler(res, validate.status, validate.success, validate.message);
    }
  } catch (error) {
    return new ResponseHandler(res, 500,false,error.message )
  
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  try {
    const user = await userService.resetPassword({ email, newPassword, confirmPassword });
    
    return new ResponseHandler(res, user.status, user.success, user.message)
  } catch (error) {
    return new ResponseHandler(res, 500,false,error.message )
  }
};

exports.profile = async (req, res) => {
  try {
    const id = req.params.id;

    const updateData = req.body;
    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    const updatedProfile = await userService.profile({ req,id,updateData });
   
    return new ResponseHandler(res, 200,true,"Profile updated" ,updatedProfile )
  } catch (error) {
    return new ResponseHandler(res, 500,false,error.message )
  }
};
