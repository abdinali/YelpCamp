const express = require('express');
const router = express.Router();
const passport = require('passport');

// controllers
const {
    getRegisterForm,
    registerUser,
    getLoginForm,
    loginUser,
    logoutUser
} = require('../controllers/users');

// async error handler
const handleAsyncErr = require('../utils/handleAsyncErr');

// mongoose model
const User = require('../models/user');

// middleware 
const { storeReturnTo } = require('../middleware');

router.route('/register')
    .get(getRegisterForm)
    .post(handleAsyncErr(registerUser));

router.route('/login')
    .get(getLoginForm)
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), loginUser);

router.get('/logout', logoutUser);

module.exports = router;