const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require('../middleware/middleware');

// register logic
router.get('/register', middleware.isNotLoggedIn, async (req, res, next) => {
    var messages = req.flash('error');
    res.render('register', {
        messages: messages
    });
});

router.post('/register', middleware.isNotLoggedIn, passport.authenticate('local-register', {
    successRedirect: '/movies',
    failureRedirect: '/buyers/register',
    failureFlash: true
}));

// login logic
router.get('/login', middleware.isNotLoggedIn, async (req, res, next) => {
    var messages = req.flash('error');
    res.render('login', {
        messages: messages
    });
});

router.post('/login', middleware.isNotLoggedIn, passport.authenticate('local-login', {
    successRedirect: '/movies',
    failureRedirect: '/buyers/login',
    failureFlash: true
}));

//  logout logic
router.get('/logout', middleware.isNotLoggedIn, middleware.isLoggedIn, function(req, res, next) {
    req.logout();
    res.redirect('/movies');
  });

module.exports = router;