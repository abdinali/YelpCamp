const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

const app = express();
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp')
  .then(() => console.log ('DATABASE CONNECTED!'))
  .catch(error => handleError(error));

app.set('views engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.send('YELPCAMP');
})

app.get('/makecampground', async (req, res) => {
    const camp = await new Campground({title: 'My Backyard', description: 'cheap camping!'})
    await camp.save();
    res.send(camp);
})

app.listen(port, () => {
    console.log(`YELPCAMP ${3000}`);
})