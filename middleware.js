const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');

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

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(req.params.id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to modify this campground');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateSchema = (schema) => {
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