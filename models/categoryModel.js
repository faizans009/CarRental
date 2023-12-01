const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    
    categoryImage : {
        type: String
    },
    companyName : {
        type: String
    },
    date: {
        type: Date,
        default: Date.now,
      },
})

Category = mongoose.model('Category', categorySchema);

module.exports = Category;