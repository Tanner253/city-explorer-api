'use strict';
const axios = require('axios')

async function getMovies (req, res) {
  try{
    let searchQuery = req.query.searchQuery;
    const movieResponse = await axios.get(`${process.env.MOVIE_URL}?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`)
    let movieList = movieResponse.data.results.map((movie) => {
      return new Movie(movie);
    });
    res.send(movieList)
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