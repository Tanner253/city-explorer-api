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
let data = require('./data/weather.json')

//setup weather endpoint
// site/weather?searchQuery="string"&lat=45&lon=45
//http://localhost:3001/weather?searchQuery=seattle&lat=42&lon=52
app.get('/weather', (req, res) =>{
  try{
    let searchQuery = req.query.searchQuery;
    let reqLat = req.query.lat;
    let reqLon = req.query.lon;
    
    let weatherObj = data.find(obj => obj.city_name.toLowerCase() === searchQuery.toLowerCase());

    console.log("this is weather Object: ", weatherObj.data);

    //weatherObj holds all weather data for the next 3 days.
    //map to find all days in object, and return an array of data
    let dailyForecast = weatherObj.data.map(day => {
        return new Forecast(day);
    })
    console.log("array of forcasts:", dailyForecast);
    res.send(dailyForecast);

  }catch(error){
    res.status(500).send('something went wrong around line 25');
  }
})

//catch all endpoints
app.get('*', (req, res) => {
  res.send('IDK what you\'re looking for but this isn\'t it')
})

//parse information for the response
class Forecast {
  constructor(day){
    this.date = day.datetime;
    this.description = day.weather.description;
  }
}
app.listen(PORT, () => console.log(`listening on port ${PORT}`));