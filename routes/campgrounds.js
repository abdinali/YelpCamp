const express = require('express');
const router = express.Router();

// controllers 
const {
	index,
	getNewForm,
	createCampground,
	showCampground,
	getEditForm,
	editCampground,
	deleteCampground,
} = require('../controllers/campgrounds');

// async error handler
const handleAsyncErr = require('../utils/handleAsyncErr');

// JOI campground schema
const { campgroundSchema } = require('../schemas');

// mongoose model
const Campground = require('../models/campground');

// middleware 
const { isLoggedIn, isAuthor, isValidSchema} = require('../middleware');

// Campground Routes
router.get('/', handleAsyncErr(index));

router.get('/new', isLoggedIn, getNewForm);

router.post('/', isLoggedIn, isValidSchema(campgroundSchema), handleAsyncErr(createCampground));

router.get('/:id', handleAsyncErr(showCampground));

router.get('/:id/edit', isLoggedIn, isAuthor(Campground), handleAsyncErr(getEditForm));

router.put('/:id', isLoggedIn, isAuthor(Campground), isValidSchema(campgroundSchema), handleAsyncErr(editCampground));

router.delete('/:id', isLoggedIn, isAuthor(Campground), handleAsyncErr(deleteCampground));

module.exports = router;