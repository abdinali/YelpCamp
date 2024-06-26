const express = require('express');
const router = express.Router();
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

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

router.route('/')
	.get(handleAsyncErr(index))
	.post(isLoggedIn, upload.array('image'), isValidSchema(campgroundSchema), handleAsyncErr(createCampground));

router.get('/new', isLoggedIn, getNewForm);

router.route('/:id')
	.get(handleAsyncErr(showCampground))
	.put(isLoggedIn, isAuthor(Campground), upload.array('image'), isValidSchema(campgroundSchema), handleAsyncErr(editCampground))
	.delete(isLoggedIn, isAuthor(Campground), handleAsyncErr(deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor(Campground), handleAsyncErr(getEditForm));

module.exports = router;