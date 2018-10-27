var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require('dotenv/config');
require('./models/movie');
require('./models/seller');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var moviesRouter = require('./routes/movies');
var sellersRouter = require('./routes/seller');
// var sellersRouter = require('./routes/seller');

var app = express();

// connect to local mongodb database
// mongoose.connect('mongodb://localhost:27017/movie-planet', {useNewUrlParser: true});

// connect to mlab database
mongoose.connect(process.env.MLAB_URL, {useNewUrlParser: true});

// add passport local strategy configuration
require('./config/passportBuyer');
require('./config/passportSeller');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/movies', moviesRouter);
app.use('/sellers', sellersRouter);
// app.use('/sellers', sellersRouter);

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
