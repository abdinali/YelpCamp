const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp')
  .then(() => console.log ('DATABASE CONNECTED!'))
  .catch(error => handleError(error));

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomLocation = sample(cities); 
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${randomLocation.city}, ${randomLocation.state}`
        })
        await camp.save();
    }
}

seedDB().then(() => {
    console.log('DATABASE CLOSED!');
    mongoose.connection.close();
});