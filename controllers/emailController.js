
// emailController.js
const nodemailer = require("nodemailer");
const { generateOTP } = require("./OTPGenerate");
const expressAsyncHandler = require("express-async-handler");
const User = require("../models/user");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

exports.sendEmail = expressAsyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Generate a new OTP as a number
    const otp = parseInt(generateOTP()); // Convert the OTP to a number

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: "OTP for car rental app",
        text: `Your OTP is: ${otp}`,
    };

    // Set the user's OTP to the new OTP and save it as a number
    user.otp = otp;
    await user.save();

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Failed to send email" });
        } else {
            console.log("Email sent successfully");
            return res.status(200).json({ message: "Email sent successfully" });
        }
    });
});
