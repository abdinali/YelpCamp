const express = require('express');
const router = express.Router({mergeParams: true});

// async error handler
const handleAsyncErr = require('../utils/handleAsyncErr');

// JOI validator
const validateSchema = require('../validation/validate');

// JOI review schema
const { reviewSchema } = require('../schemas');

// mongoose models
const Campground = require('../models/campground');
const Review = require('../models/review');

// Reviews Routes
router.post('/', validateSchema(reviewSchema), handleAsyncErr(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', handleAsyncErr(async(req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    const campground = await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    res.redirect(`/campgrounds/${campground._id}`);
}))

module.exports = router;