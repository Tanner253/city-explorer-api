'use strict';

//setup middleware and dependencies
require('dotenv').config();

//express before cors
const express = require('express');
const cors = require('cors');

//start express
const app = express();
//use this port
const PORT = process.env.PORT || 3002;

//allow data to be sent accross internet
app.use(cors());
//import data that we are using

//load modules
const getWeather = require('./modules/weather')
const getMovies = require('./modules/movie')

//call weather api
app.get('/weather', getWeather)
//call movies api
app.get('/movies', getMovies)



//catch all endpoints
app.get('*', (req, res) => {
  res.send('IDK what you\'re looking for but this isn\'t it')
})
//proof of env
app.listen(PORT, () => console.log(`listening on port ${PORT}`));