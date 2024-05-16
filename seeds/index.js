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
        const change = [0.49, 0.79, 0.95, 0.99];
        const price = (Math.floor(Math.random() * 30) + 10) + change[Math.floor(Math.random() * change.length)];
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            price: price,
            description: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
                          Ab totam eaque dolor ipsum ipsa natus architecto eos doloribus 
                          vero beatae, temporibus aliquid atque odio maxime fugit sint 
                          distinctio minima eius.`,
            location: `${randomLocation.city}, ${randomLocation.state}`,
        })
        await camp.save();
    }
}

seedDB().then(() => {
    console.log('DATABASE CLOSED!');
    mongoose.connection.close();
});