
const generateOTP = require("otp-generator");

exports.generateOTP = () => {
    const OTP = generateOTP.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });

    // Ensure the OTP is exactly 6 characters in length
    if (OTP.length > 6) {
        return OTP.slice(0, 6); // Take the first 6 characters
    }
    return { otp: OTP, expiresAt: Date.now() + 60 * 1000 };
    // return OTP;
};
