const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateToken = require("../middlewares/jwt");

exports.signUp = async (req, res) => {
  const { username, email, password, mobile,admin } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    } 

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
      mobile: mobile,
      admin: admin
    });

    // Generate a token with a 1-hour expiration time
    const token = generateToken(res,newUser);

    // Save the token in the user document
    newUser.token = token;
    await newUser.save();

    return res
      .status(201)
      .json({
        message: "New user created successfully",
        user: newUser,
        token: token,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

exports.getUser = async(req,res) => {
    try{
        const {id} = req.body;
        const user = await User.findById(id);
        if (!user){
            return res.status(404).json({message: "User not found"})
        }

        res.status(200).json({ user });
    } 
    catch (error) {
      res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password matches
    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

  
    const token = generateToken(res,existingUser);

    res.status(201).json({ user: existingUser, token: token });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

exports.validateOTP = async (req, res) => {
  const { email, enteredOTP } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Parse the enteredOTP as an integer
    const parsedEnteredOTP = parseInt(enteredOTP, 10);

    if (isNaN(parsedEnteredOTP)) {
      return res.status(400).json({ message: "Invalid OTP format" });
    }

    // Compare the parsedEnteredOTP with the OTP stored in the user document
    if (user.otp !== parsedEnteredOTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // If the OTP is valid, you can clear the OTP field in your database
    user.otp = null;
    await user.save();

    
    const token = generateToken(newUser);

    res.status(200).json({ message: "OTP is valid", token });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm password do not match" });
    }

    // Update the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

exports.profile = async (req,res) => {
    try{
        const {id, gender, postcode, address} = req.body;

        const profile = await User.findOneAndUpdate(
            {id:id},
            {gender: gender, postcode: postcode, address: address},
            {new: true}
            );
            return res.status(200).json({message: "profile created", profile});

    }
    catch(error){
        console.log(error);
        
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }

}
