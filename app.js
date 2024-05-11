const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.set('views engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.send('YELPCAMP');
})

app.listen(port, () => {
    console.log(`YELPCAMP ${3000}`);
})