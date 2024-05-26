const mongoose = require('mongoose');

const campgroundSchema = new mongoose.Schema({
    title: {
        type: String
    },
    image: {
        type: String
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    reviews: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Review'
        }
    ]
})

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;