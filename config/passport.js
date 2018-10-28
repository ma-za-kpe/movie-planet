const passport = require('passport');
const Buyer = require('../models/buyer');
const LocalStrategy = require('passport-local');

passport.serializeUser((buyer, done) => {
  done(null, buyer.id);
});

passport.deserializeUser((id, done) => {
  Buyer.findById(id, (err, buyer) => {
    done(err, buyer);
  });
});

// register logic
passport.use('local-register', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  Buyer.findOne({ 'email': email }, (err, buyer) => {
    if (err) {
      return done(err);
    }
    if (buyer) {
      return done(null, false, { message: 'This email is already used'})
    }
    let newBuyer = new Buyer();
    newBuyer.email = email;
    newBuyer.password = newBuyer.encryptPassword(passport);
    newBuyer.save((err, result) => {
      if (err) {
        return done(err);
      }
      return done(null, newBuyer);
    })
  })
}));

// login logic
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  if (errors) {
    let messages = [];
    console.log(errors);
    errors.forEach(function(error) {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages))
  }
  Buyer.findOne({ 'email': email }, (err, buyer) => {
    if (err) {
      return done(err);
    }
    if (!buyer) {
      return done(null, false, { message: 'No user found.'})
    }
    // valid password comes from user model
    if(!buyer.validPassword(password)) {
      return done(null, false, { message: 'Wrong password.'})
    }
    return done(null, buyer);
  })
}));