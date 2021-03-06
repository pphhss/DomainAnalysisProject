var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var registerRouter = require('./routes/registerItem');
var borrowRouter = require('./routes/borrowItem');
var adminRouter = require('./routes/admin');

var expresslayout = require('express-ejs-layouts');

var csessionManager = require('./utils/session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//setting layout.
/*
app.set('layout','layouts/layout');
app.set("layout extractScripts", false);
app.use(expresslayout);
*/

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ // setting session
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(csessionManager) //setting client session.

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/registerItem',registerRouter);
app.use('/borrowItem',borrowRouter);
app.use('/admin',adminRouter);

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
