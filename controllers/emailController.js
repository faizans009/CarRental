
const ResponseHandler = require("../utils/responseHandler")
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


exports.sendEmail = async (res,email, otp) => {
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: "OTP for car rental app",
        text: `Your OTP is: ${otp}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return new ResponseHandler(500, false, "Failed to send email")
        } else {
            return new ResponseHandler(res, 200, true, "Email sent successfully")
        }
    });
}