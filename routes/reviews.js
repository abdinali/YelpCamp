const express = require('express');
const router = express.Router({mergeParams: true});

// controllers
const {
    createReview,
    deleteReview
} = require('../controllers/reviews');

// async error handler
const handleAsyncErr = require('../utils/handleAsyncErr');

// JOI review schema
const { reviewSchema } = require('../schemas');

// mongoose models
const Campground = require('../models/campground');
const Review = require('../models/review');

// middleware 
const { isLoggedIn, isAuthor, isValidSchema } = require('../middleware');

// Reviews Routes
router.post('/', isLoggedIn, isValidSchema(reviewSchema), handleAsyncErr(createReview));

router.delete('/:reviewId', isLoggedIn, isAuthor(Review), handleAsyncErr(deleteReview));

module.exports = router;