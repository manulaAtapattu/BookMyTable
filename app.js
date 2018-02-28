var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");
var methodOverride  = require("method-override");
var mysql           = require("mysql");
const sqlcon = require('./config/database');




var index = require('./routes/index');
var users = require('./routes/users');
var customer=require('./routes/customer');
var restaurant=require('./routes/restaurant');
var admin=require('./routes/admin');
var restaurant_owner=require('./routes/restaurant_owner');


var app = express();



sqlcon.db.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + sqlcon.db.threadId);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret: 'codemaveriks'}));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/', index);
app.use('/users', users);
app.use('/customers', customer);
app.use('/admin', admin);
app.use('/restaurants', restaurant);
app.use('/restaurant_owners', restaurant_owner);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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



app.listen("3000", function(){
    console.log("Server started...")
});

module.exports = app;
