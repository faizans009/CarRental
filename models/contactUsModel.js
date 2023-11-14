const mongoose = require('mongoose')
const contactUsSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: Number
    },
    message: {
        type: String
    },
})
const ContactUs = mongoose.model('ContactUs',contactUsSchema)
module.exports = ContactUs;