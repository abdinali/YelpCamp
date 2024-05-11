const mongoose = require('mongoose');

const campgroundSchema = new mongoose.Schema({
    title: {
        type: String
    },
    Price: {
        type: String
    },
    Description: {
        type: String
    },
    Location: {
        type: String
    }
})

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;