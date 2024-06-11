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
            author: '6667a4c821af7b88232906a9',
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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