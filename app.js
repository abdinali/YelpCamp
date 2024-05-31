const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

// routes
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

const app = express();
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp')
  .then(() => console.log ('DATABASE CONNECTED!'))
  .catch(error => handleError(error));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// Home Page
app.get('/', (req, res) => {
    res.render('home');
})

// Campground Routes
app.use('/campgrounds', campgrounds);

// Reviews
app.use('/campgrounds/:id/reviews', reviews);

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