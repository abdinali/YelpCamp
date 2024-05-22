const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const handleAsyncErr = require('./utils/handleAsyncErr');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

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

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/campgrounds', handleAsyncErr(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}))

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', handleAsyncErr(async (req, res) => {
    if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    // if(!(req.body.campground.price === Number)) throw new ExpressError('Casting Error', 200);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.get('/campgrounds/:id', handleAsyncErr(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground})
}))

app.get('/campgrounds/:id/edit', handleAsyncErr(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground})
}))

app.put('/campgrounds/:id', handleAsyncErr(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, {...req.body.campground});
    console.log(req.body.campground);
    res.redirect(`/campgrounds/${id}`)
}))

app.delete('/campgrounds/:id', handleAsyncErr(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh No, Someting Went Wrong!';
    res.status(statusCode).render('error', {err});
})

app.listen(port, () => {
    console.log(`YELPCAMP ${3000}`);
})