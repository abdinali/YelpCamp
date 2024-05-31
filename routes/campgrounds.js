const express = require('express');
const router = express.Router();

// async error handler
const handleAsyncErr = require('../utils/handleAsyncErr');

// JOI validator
const validateSchema = require('../validation/validate');

// JOI campground schema
const { campgroundSchema } = require('../schemas');

// mongoose model
const Campground = require('../models/campground');

// Campground Routes
router.get('/', handleAsyncErr(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}))

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', validateSchema(campgroundSchema), handleAsyncErr(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/:id', handleAsyncErr(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', {campground});
}))

router.get('/:id/edit', handleAsyncErr(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground});
}))

router.put('/:id', validateSchema(campgroundSchema), handleAsyncErr(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${id}`);
}))

router.delete('/:id', handleAsyncErr(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

module.exports = router;