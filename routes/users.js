const express = require('express');
const router = express.Router();
const passport = require('passport');

// async error handler
const handleAsyncErr = require('../utils/handleAsyncErr');

// mongoose model
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', handleAsyncErr(async (req, res) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registed_user = await User.register(user, password);
        req.flash('success', 'Welcome to YelpCamp!');
        res.redirect('/campgrounds');
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', `Welcome back, ${req.body.username}!`);
    res.redirect('/campgrounds')
})

module.exports = router;