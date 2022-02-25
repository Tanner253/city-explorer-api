'use strict';
const axios = require('axios')

let cache = require('./cache.js');
async function getMovies (req, res) {
  try{
    let searchQuery = req.query.searchQuery;

    //setup cache key
    let key = searchQuery + "Movies"
    //check cache for data
    if(cache[key] && (Date.now() - cache[key].timestamp) < 1000 * 20){
      console.log("cache hit, movie data present, HURRAY")
      res.status(200).send(cache[key].data);
    }else{
      console.log("cache miss in movies.js")
      const movieResponse = await axios.get(`${process.env.MOVIE_URL}?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`)
      let movieList = movieResponse.data.results.map((movie) => {
        return new Movie(movie);
      });
      cache[key] = {
        data: movieList,
        timestamp: Date.now()
      }
      res.send(movieList)
    }
  }catch(e){
    res.status(500).send('Movie route problem');
  }
}

class Movie {
  constructor(movie){
    this.title = movie.title;
    this.description = movie.overview;
    this.releaseDate = movie.release_date
  }
}

module.exports = getMovies;