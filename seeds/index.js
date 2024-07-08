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
    for (let i = 0; i < 300; i++) {
        const randomLocation = sample(cities); 
        const change = [0.49, 0.79, 0.95, 0.99];
        const price = (Math.floor(Math.random() * 30) + 10) + change[Math.floor(Math.random() * change.length)];

        const camp = new Campground({
            author: '6667a4c821af7b88232906a9',
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: 'Point',
                coordinates: [
                    randomLocation.longitude,
                    randomLocation.latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dzqgunluk/image/upload/v1719551524/YelpCamp/lhz7lic5wmqyqri8kgqa.jpg',
                    filename: 'YelpCamp/mvatfuebo2txjpvvie6u',
                },
                {
                    url: 'https://res.cloudinary.com/dzqgunluk/image/upload/v1718933410/YelpCamp/awqhqt8mtnntojusnm9c.jpg',
                    filename: 'YelpCamp/awqhqt8mtnntojusnm9c',
                }
            ],
            price: price,
            description: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ab totam eaque dolor ipsum ipsa natus architecto eos doloribus`,
            location: `${randomLocation.city}, ${randomLocation.state}`,
        })
        await camp.save();
    }
}

seedDB().then(() => {
    console.log('DATABASE CLOSED!');
    mongoose.connection.close();
});