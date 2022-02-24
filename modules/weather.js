'use strict';
const axios = require('axios')


async function getWeather (req, res) {
  try{
    let lat = req.query.lat;
    let lon = req.query.lon;
    const weatherResponse = await axios.get(`${process.env.WEATHER_URL}?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`);
    
    let dailyForecast = weatherResponse.data.data.map(day => {
      return new Forecast(day);
    })
    res.send(dailyForecast);
  }catch(error){
    res.status(500).send('Weather route problem');
  }
}
//parse information for the weather response
class Forecast {
  constructor(day){
    this.date = day.datetime;
    this.description = `Weather description - ${day.weather.description}`;
  }
}
module.exports = getWeather;