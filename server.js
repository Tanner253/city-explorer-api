'use strict';

//setup middleware and dependencies
require('dotenv').config();
const axios = require('axios')
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

//setup weather endpoint
// site/weather?searchQuery="string"&lat=45&lon=45
app.get('/weather', async (req, res) => {
  try{
    let lat = req.query.lat;
    let lon = req.query.lon;
    const weatherResponse = await axios.get(`${process.env.WEATHER_URL}?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`);
    
    // console.log("weatherResponse", weatherResponse.data);
    let dailyForecast = weatherResponse.data.data.map(day => {
      return new Forecast(day);
    })
    // console.log("array of forcasts:", dailyForecast);
    res.send(dailyForecast);
  }catch(error){
    res.status(500).send('Weather route problem');
  }
})
//setup movie endpoint
//example successful api call 
//https://api.themoviedb.org/3/search/movie/?api_key=f7c1033c350dd558e0715a6ae1f8f99b&query=Seattle
app.get('/movies', async (req, res) => {
  try{
    let searchQuery = req.query.searchQuery;
    const movieResponse = await axios.get(`${process.env.MOVIE_URL}?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`)
    console.log("From the movies endpoint", movieResponse.data);
    
    let movieList = movieResponse.data.results.map((movie) => {
      return new Movie(movie);
    });
    console.log(movieList);
    res.send(movieList)
  }catch(e){
    res.status(500).send('Movie route problem');
  }
})
//catch all endpoints
app.get('*', (req, res) => {
  res.send('IDK what you\'re looking for but this isn\'t it')
})

//parse information for the weather response
class Forecast {
  constructor(day){
    this.date = day.datetime;
    this.description = day.weather.description;
  }
}
//parse information for the movie response
class Movie {
  constructor(movie){
    this.title = movie.title;
    this.description = movie.overview;
    this.releaseDate = movie.release_date
  }
}
app.listen(PORT, () => console.log(`listening on port ${PORT}`));