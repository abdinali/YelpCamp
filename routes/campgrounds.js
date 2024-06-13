const express = require('express');
const router = express.Router();

// async error handler
const handleAsyncErr = require('../utils/handleAsyncErr');

// JOI campground schema
const { campgroundSchema } = require('../schemas');

// mongoose model
const Campground = require('../models/campground');

// middleware 
const { isLoggedIn, isAuthor, isValidSchema} = require('../middleware');

// Campground Routes
router.get('/', handleAsyncErr(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', isLoggedIn, isValidSchema(campgroundSchema), handleAsyncErr(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/:id', handleAsyncErr(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate(
            {path: 'reviews', populate: {
                path: 'author'
            }}
        )
        .populate('author');
    if(!campground) {
        req.flash('error', 'Campground cannot be found with this URL.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}))

router.get('/:id/edit', isLoggedIn, isAuthor(Campground), handleAsyncErr(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground) {
        req.flash('error', 'Campground cannot be found with this URL.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}))

router.put('/:id', isLoggedIn, isAuthor(Campground), isValidSchema(campgroundSchema), handleAsyncErr(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Successfully updated camground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', isLoggedIn, isAuthor(Campground), handleAsyncErr(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds');
}))

module.exports = router;