const mongoose = require('mongoose');
const Review = require('./review');

const imageSchema = new mongoose.Schema({
    url: String,
    filename: String
})

const campgroundSchema = new mongoose.Schema({
    title: {
        type: String
    },
    images: {
        type: [imageSchema]
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number]
        }
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
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Review'
        }
    ]
}, {    
    toJSON: { virtuals: true }
})

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
})

campgroundSchema.virtual('properties').get(function() {
    return {
        id: this.id,
        title: this.title,
        description: this.description
    };
})

campgroundSchema.post('findOneAndDelete', async (deletedCampground) => {
    if (deletedCampground) {
        await Review.deleteMany({
            _id: {
                $in: deletedCampground.reviews
            }
        })
    }
})

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;