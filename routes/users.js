const express = require('express');
const router = express.Router();
const passport = require('passport');

// async error handler
const handleAsyncErr = require('../utils/handleAsyncErr');

// mongoose model
const User = require('../models/user');

// middleware 
const { storeReturnTo } = require('../middleware');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', handleAsyncErr(async (req, res, next) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registed_user = await User.register(user, password);
        req.login(registed_user, (err) => {
            if (err) return next(err);
            req.flash('success', `Welcome to YelpCamp, ${req.user.username}!`);
            res.redirect('/campgrounds');
        })
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', `Welcome back, ${req.body.username}!`);
    const redirect_url = res.locals.returnTo || '/campgrounds';
    res.redirect(redirect_url);
})

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success', 'Successfully logged out.');
        res.redirect('/campgrounds');
    });
})

module.exports = router;