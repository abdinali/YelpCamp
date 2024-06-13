const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');
const { model } = require('mongoose');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor = (model) => {
    return async (req, res, next) => {
        const id = model === Campground ? req.params.id : req.params.reviewId;
        doc = await model.findById(id);
        if (!doc.author.equals(req.user._id)) {
            const type = model === Campground ? 'campground' : 'review';
            req.flash('error', `You do not have permission to modify this ${type}.`);
            return res.redirect(`/campgrounds/${id}`);
        }
        next();    
    }
}

module.exports.isValidSchema = (schema) => {
    return (req, res, next) => {
        const {error} = schema.validate(req.body);
        if(error) {
            console.log(error);
            const msg = error.details.map(el => el.message).join(',');
            throw new ExpressError(msg, 400);
        } else {
            next();
        }
    }
}