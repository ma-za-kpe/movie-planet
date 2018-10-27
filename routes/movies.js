var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');

/* GET movies listing. */
router.get('/', async(req, res, next) => {

  const movies = await Movie.find().sort('title')
  res.send(movies);
});

// Post/create a movie
router.post('/', async(req, res, next) => {

    const movie = new Movie({
        imageUrl: req.body.imageUrl,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price
    });
    await movie.save();
    res.send(movie);
  });

//   Update a movie

router.put('/:id', async(req, res, next) => {

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        imageUrl: req.body.imageUrl,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price
    }, {new: true});
    if (!movie) {
        return res.status(404).send('Movie with given ID not found');
    }
    res.send(movie);
  });

// Delete a movie
router.delete('/:id', async(req, res, next) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) {
        return res.status(404).send('Movie with given ID not found');
    }
    res.send(movie);
  });

//   Find movie by ID
router.get('/:id', async(req, res, next) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
        return res.status(404).send('Movie with given ID not found');
    }
    res.send(movie);
  });

module.exports = router;
