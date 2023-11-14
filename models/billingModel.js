const mongoose = require('mongoose');
const billingSchema = new mongoose.Schema({
    Name : {
        type: String,
        required: true
    },
    PhoneNo : {
        type: Number,
        required: true
    },
    Address : {
        type: String,
        required: true
    },
    Town : {
        type: String,
        required: true
    },

})
Billing = mongoose.model('Billing',billingSchema);
module.exports = Billing;