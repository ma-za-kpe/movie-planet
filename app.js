const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);
require('dotenv/config');
require('./models/movie');
require('./models/seller');
require('./models/buyer');

const indexRouter = require('./routes/index');
const moviesRouter = require('./routes/movies');
const sellersRouter = require('./routes/seller');
const buyersRouter = require('./routes/buyer');

const app = express();

// connect to local mongodb database
// mongoose.connect('mongodb://localhost:27017/movie-planet', {useNewUrlParser: true});

// connect to mlab database
var dbURI = 'mongodb://localhost/Loc8r';
if (process.env.NODE_ENV === 'production') {
dbURI = 'mongodb://movie-planet-team:moviePlanet2018@ds125302.mlab.com:25302/movie-planet'
}
mongoose.connect(dbURI, {useNewUrlParser: true});
//mongoose.connect(process.env.MLAB_URL, {useNewUrlParser: true});

// add passport local strategy configuration
require('./config/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'expressseceret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 15 * 60 * 1000 } //session expires in 15 min
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  // add a login variable to our views to check if user is logged in
  res.locals.login = req.isAuthenticated(); // passgin the login status to our view
  res.locals.session = req.session; // passing the session object to our views
  next();
});

app.use('/', indexRouter);
app.use('/movies', moviesRouter);
app.use('/sellers', sellersRouter);
app.use('/buyers', buyersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
