const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    companyName : {
        type: String
    },
    image:  [{
         type: String 
        }],
    carName: {
        type: String
    },
    carType: {
        type: String
    },
    fuelCapacity: {
        type: String
    },
    steering: {
        type: String
    },
    capacity: {
        type: String
    },
    make: {
        type: String
    },
    model: {
        type: Number
    },
    registrationCity: {
        type: String
    },
    transmission: {
        type: String
    },
    
    rating: {
        type: Number,
        default:0
    },
    reviews: [{ 
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        car: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Car',
            required: true
        },
        
        review: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            default: Date.now,
          },
     }],
    condition: {
        type: String
    },
    fuelType:{
        type: String
    },
    carDesc: {
        type: String
    },

})
Cars = mongoose.model('Car', carSchema);

module.exports = Cars;