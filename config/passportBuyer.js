var passport = require('passport');
var Buyer = require('../models/buyer');
var LocalStrategy = require('passport-local');

passport.serializeUser(function(buyer, done) {
  done(null, buyer.id);
});

passport.deserializeUser(function(id, done) {
  Buyer.findById(id, function(err, buyer) {
    done(err, buyer);
  });
});

// register logic
passport.use('local-register-buyer', new LocalStrategy({
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
  Buyer.findOne({ 'email': email }, function(err, buyer) {
    if (err) {
      return done(err);
    }
    if (buyer) {
      return done(null, false, { message: 'This email is already used'})
    }
    var newBuyer = new Buyer();
    newBuyer.email = email;
    newBuyer.password = newBuyer.encryptPassword(passport);
    newBuyer.save(function(err, result) {
      if (err) {
        return done(err);
      }
      return done(null, newBuyer);
    })
  })
}));

// sign in logic
passport.use('local-login-buyer', new LocalStrategy({
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
  Buyer.findOne({ 'email': email }, function(err, buyer) {
    if (err) {
      return done(err);
    }
    if (!buyer) {
      return done(null, false, { message: 'No user found.'})
    }
    // valid password comes from buyer model
    if(!buyer.validPassword(password)) {
      return done(null, false, { message: 'Wrong password.'})
    }
    return done(null, buyer);
  })
}))