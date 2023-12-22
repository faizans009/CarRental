
const ResponseHandler = require("../utils/responseHandler")
const nodemailer = require("nodemailer");
const { generateOTP } = require("./OTPGenerate");
const expressAsyncHandler = require("express-async-handler");
const User = require("../models/user");

// const ResponseHandler = require("../utils/responseHandler")

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

// exports.sendEmail = expressAsyncHandler(async (req, res) => {
//     const { email } = req.body;
//     const user = await User.findOne({ email: email });
//     if (!user) {
//         return new ResponseHandler(res, 404,false,"User not found" )
//         // return res.status(404).json({ message: "User not found" });
//     }

//     // Generate a new OTP as a number
//     const otp = generateOTP(); // Convert the OTP to a number
// console.log(otp);

//     const mailOptions = {
//         from: process.env.SMTP_MAIL,
//         to: email,
//         subject: "OTP for car rental app",
//         text: `Your OTP is: ${otp}`,
//     };
    
//     // Set the user's OTP to the new OTP and save it as a number
//     user.otp.value = otp;
//     user.otp.createdAt = new Date(Date.now())
//     user.otp.expiresAt = new Date(user.otp.createdAt.getTime() + 60 * 1000);
//     await user.save();
//     console.log(user);
    

//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             return new ResponseHandler(res, 500,false,"Failed to send email" )
//             // return res.status(500).json({ message: "Failed to send email" });
//         } else {
//             return new ResponseHandler(res, 200,true,"Email sent successfully" )
//             // return res.status(200).json({ message: "Email sent successfully" });
//         }
//     });
// });
exports.sendEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: "OTP for car rental app",
        text: `Your OTP is: ${otp}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return new ResponseHandler(500,false,"Failed to send email" )
            // return res.status(500).json({ message: "Failed to send email" });
        } else {
            return new ResponseHandler(res, 200,true,"Email sent successfully" )
            // return res.status(200).json({ message: "Email sent successfully" });
        }
    });
}