if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

// routes
const user_routes = require('./routes/users');
const campground_routes = require('./routes/campgrounds');
const review_routes = require('./routes/reviews');

const app = express();
const port = 3000;

const sessionConfig = {
    secret: 'mySecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp')
  .then(() => console.log ('DATABASE CONNECTED!'))
  .catch(error => handleError(error));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.current_user = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Home Page
app.get('/', (req, res) => {
    res.render('home');
})

// User Routes 
app.use('/', user_routes);

// Campground Routes
app.use('/campgrounds', campground_routes);

// Reviews Routes
app.use('/campgrounds/:id/reviews', review_routes);

// Error Middleware
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh No, Someting Went Wrong!';
    res.status(statusCode).render('error', {err});
})

app.listen(port, () => {
    console.log(`YELPCAMP ${port}`);
})