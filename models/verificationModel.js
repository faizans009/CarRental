const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
    licenseNo: String,
    frontImage: String,
    backImage: String

})
Verification = mongoose.model('Verification', verificationSchema);

module.exports = Verification;