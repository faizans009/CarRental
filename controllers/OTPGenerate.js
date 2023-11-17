
const generateOTP = require("otp-generator");

exports.generateOTP = () => {
    let OTP = generateOTP.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });
    OTP = Number(OTP);
    
    
    if (OTP.length > 6) {
        return OTP.slice(0, 6);
    }
    
    return OTP;
};
