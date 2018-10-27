var passport = require('passport');
var Seller = require('../models/seller');
var LocalStrategy = require('passport-local');

passport.serializeUser(function(seller, done) {
  done(null, seller.id);
});

passport.deserializeUser(function(id, done) {
  Seller.findById(id, function(err, seller) {
    done(err, seller);
  });
});

// register logic
passport.use('local-register', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  if (errors) {
    var messages = [];
    console.log(errors);
    errors.forEach(function(error) {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages))
  }
  Seller.findOne({ 'email': email }, function(err, seller) {
    if (err) {
      return done(err);
    }
    if (seller) {
      return done(null, false, { message: 'This email is already used'})
    }
    var newSeller = new Seller();
    newSeller.email = email;
    newSeller.password = newSeller.encryptPassword(passport);
    newSeller.save(function(err, result) {
      if (err) {
        return done(err);
      }
      return done(null, newSeller);
    })
  })
}));

// sign in logic
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  if (errors) {
    var messages = [];
    console.log(errors);
    errors.forEach(function(error) {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages))
  }
  Seller.findOne({ 'email': email }, function(err, seller) {
    if (err) {
      return done(err);
    }
    if (!seller) {
      return done(null, false, { message: 'No user found.'})
    }
    // valid password comes from seller model
    if(!seller.validPassword(password)) {
      return done(null, false, { message: 'Wrong password.'})
    }
    return done(null, seller);
  })
}))