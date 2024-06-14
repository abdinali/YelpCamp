const User = require('../models/user');

module.exports.getRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async (req, res, next) => {
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
}

module.exports.getLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.loginUser = (req, res) => {
    req.flash('success', `Welcome back, ${req.body.username}!`);
    const redirect_url = res.locals.returnTo || '/campgrounds';
    res.redirect(redirect_url);
}

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success', 'Successfully logged out.');
        res.redirect('/campgrounds');
    });
}