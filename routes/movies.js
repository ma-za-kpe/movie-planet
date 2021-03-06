var express = require('express');
var router = express.Router();
const Movie = require('../models/movie');
const Cart = require('../models/cart');
const stripe = require('stripe')('sk_test_p4hGcGu7dzVW1Rfhr1LUePHS');

/* GET movies listing. */
router.get('/', async(req, res, next) => {
    var successMsg = req.flash('success')[0];
  const movies = await Movie.find().sort('title')
//   res.send(movies);

    res.render('index', {movies: movies, successMsg: successMsg});
});

// GET Show add new movie form
router.get('/add-new-movies', async(req, res, next) => {
    res.render('addMovieForm');
});

// Post/create a movie
router.post('/', async(req, res, next) => {

    const movie = new Movie({
        imageUrl: req.body.imageUrl,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price || 1000
    });
    await movie.save();
    // res.send(movie);
    res.redirect('/movies');
  });

//   Update a movie

// router.put('/:id', async(req, res, next) => {

//     const movie = await Movie.findByIdAndUpdate(req.params.id, {
//         imageUrl: req.body.imageUrl,
//         title: req.body.title,
//         description: req.body.description,
//         price: req.body.price
//     }, {new: true});
//     if (!movie) {
//         return res.status(404).send('Movie with given ID not found');
//     }
//     res.send(movie);
//   });

// Delete a movie
// router.delete('/:id', async(req, res, next) => {
//     const movie = await Movie.findByIdAndRemove(req.params.id);
//     if (!movie) {
//         return res.status(404).send('Movie with given ID not found');
//     }
//     res.send(movie);
//   });

//   Find movie by ID
// router.get('/:id', async(req, res, next) => {
//     const movie = await Movie.findById(req.params.id);
//     if (!movie) {
//         return res.status(404).send('Movie with given ID not found');
//     }
//     res.send(movie);
//   });

//   add to cart logic
router.get('/add-to-cart/:id', (req, res, next) => {
    let movieId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    Movie.findById(movieId, (err, movie) => {
        if (err) {
            res.redirect('/movies');
        }
        cart.add(movie, movie.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/movies');
    })
});

//   go to checkout page
router.get('/cart', (req, res, next) => {
    if (!req.session.cart) {
        return res.render('cart', {movies: null});
    }
    let cart = new Cart(req.session.cart);
    res.render('cart', {movies: cart.generateArray(), totalPrice: cart.totalPrice});
});

// go to checkout page
router.get('/checkout', (req, res, next) => {
    if (!req.session.cart) {
        return res.redirect('/movies/cart');
    }
    let cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('checkout', {totalPrice: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', (req, res, next) => {
    if (!req.session.cart) {
        return res.redirect('/movies/cart');
      }
      var cart = new Cart(req.session.cart);
      stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
      }, function(err, charge) {
        if(err) {
          req.flash('error', err.message);
          res.redirect('/movies/checkout');
        }
        req.flash('success', 'Successfully bought product!');
        req.session.cart = null;
        res.redirect('/movies');
    });
});

module.exports = router;
