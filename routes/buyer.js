const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var Buyer = mongoose.model('Buyer');

// register logic
router.get('/register', async (req, res, next) => {
    var messages = req.flash('error');
    res.render('register', {
        messages: messages
    });
});

router.post('/register', passport.authenticate('local-register', {
    successRedirect: '/movies',
    failureRedirect: '/buyers/register',
    failureFlash: true
}));

// login logic
router.get('/login', async (req, res, next) => {
    var messages = req.flash('error');
    res.render('login', {
        messages: messages
    });
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/movies',
    failureRedirect: '/buyers/login',
    failureFlash: true
}));

//  logout logic
router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/movies');
  });


// register buyers
// router.get('/register', async(req, res, next) => {
//     const buyers = await Buyer.find().sort('email')
//     // res.send(buyers);
//     res.render('register');
//   });

// router.post('/register', async(req, res, next) => {
//     let buyer = await Buyer.findOne({email: req.body.email})
//     if (buyer) {
//         return res.status(400).send('Buyer already registered')
//     }
//     buyer = new Buyer({
//         email: req.body.email,
//         password: req.body.password
//     })
//     buyer.password = buyer.encryptPassword();
//     await buyer.save();
//     req.flash('success', 'Successfully signed up!')
//     // res.send(buyer)
//     res.redirect('/movies');
// });

// // login buyers
// router.get('/login', async(req, res, next) => {
//     const buyers = await Buyer.find().sort('email')
//     // res.send(buyers);
//     res.render('login');
//   });

module.exports = router;