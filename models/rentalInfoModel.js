const mongoose = require('mongoose');
const RentalInfoSchema = new mongoose.Schema({
    Pickup: {
        location: {
            type: String,
            required: true
        },
        date:{
            type: Date,
            required: true
        },
        time: {
            type: String,
            required:true
        }
    },
    DropOff: {
        location: {
            type: String,
            required: true
        },
        date:{
            type: Date,
            required: true
        },
        time: {
            type: String,
            required:true
        }
    }
})
RentalInfo = mongoose.model('RentalInfo', RentalInfoSchema)
module.exports= RentalInfo