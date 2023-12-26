const mongoose = require('mongoose')
const contactUsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
        type: String
    },
    message: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now,
      },
})
const ContactUs = mongoose.model('ContactUs',contactUsSchema)
module.exports = ContactUs;