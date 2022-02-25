'use strict';
const axios = require('axios')

let cache = {};

async function getWeather (req, res) {
  try{
    
    let lat = req.query.lat;
    let lon = req.query.lon;
    //cache key setup
    let key = req.query.searchQuery + lat + lon;
    //check cache
    if(cache[key] && (Date.now() - cache[key].timestamp) <  1000 * 20){
      console.log('cache hit, weather present, HURRAY');
      res.status(200).send(cache[key].data);
    }else{
      console.log('cache miss in weather.js');
      const weatherResponse = await axios.get(`${process.env.WEATHER_URL}?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`);
      
      let dailyForecast = weatherResponse.data.data.map(day => {
        return new Forecast(day);
      })
      cache[key] = {
        data: dailyForecast,
        timestamp: Date.now()
      }
      res.send(dailyForecast);
    }
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