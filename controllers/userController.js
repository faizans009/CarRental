const User = require("../models/user");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const generateToken = require("../middlewares/jwt");
const ResponseHandler = require("../utils/responseHandler")

exports.signUp = async (req, res) => {
  const { username, email, password, mobile,admin } = req.body;
  try {
   
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return new ResponseHandler(res, 400,false,"User already exists" )
    } 
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
      mobile: mobile,
      admin: admin
    });

    const token = generateToken(res,newUser);

    newUser.token = token;
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
        const user = await User.findById(id);
        if (!user){
          return new ResponseHandler(res, 404,false,"User not found" )
        }
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
  const { email, password } = req.body;
  try {
    
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return new ResponseHandler(res,404,false,"User not found" )
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return new ResponseHandler(res, 400,false,"Invalid Credentials" )
    }

  
    const token = generateToken(res,existingUser);
    return new ResponseHandler(res, 201,true,"Sign in Successfully",{existingUser,token} )
  } catch (error) {
    return new ResponseHandler(res, 500,false,error.message )
  }
};

exports.validateOTP = async (req, res) => {
  const { email, enteredOTP } = req.body;

  try {
    
    
    const user = await User.findOne({ email });

    if (!user) {
      return new ResponseHandler(res, 404,false,"User not found" )
    }
    const parsedEnteredOTP = parseInt(enteredOTP, 10);
    
    if (isNaN(parsedEnteredOTP)) {
      return new ResponseHandler(res, 400,false,"Invalid OTP format" )
    }

    if (user.otp.value !== parsedEnteredOTP) {
      return new ResponseHandler(res, 400,false,"Invalid OTP" )
    }
    if ( Date.now() > user.otp.expiresAt){
      return new ResponseHandler(res, 400,false,"OTP expired" )
    }
    
    await user.save();

    
    const token = generateToken(res, user);
    return new ResponseHandler(res, 200,true,"OTP is valid", { token } )
  } catch (error) {
    return new ResponseHandler(res, 500,false,error.message )
  
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return new ResponseHandler(res, 404,false,"User not found" )
    }
    if (newPassword !== confirmPassword) {
      return new ResponseHandler(res, 400,false,"Password and confirm password do not match" )
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();
    return new ResponseHandler(res, 200,true,"Password reset successful" )
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

    const existingUser = await User.findOne({ _id: id });

    if (!existingUser) {
      return new ResponseHandler(res, 404,false,"User not found" )
    }

    const updatedProfile = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProfile) {
      return new ResponseHandler(res, 404,false,"User not found" )
    }
    return new ResponseHandler(res, 200,true,"Profile updated" ,updatedProfile )
  } catch (error) {
    return new ResponseHandler(res, 500,false,error.message )
  }
};
