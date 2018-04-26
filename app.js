var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");
var methodOverride  = require("method-override");
// var mysql           = require("mysql");
const sqlcon = require('./config/database');
// const mongo = require('./config/mongodb');


var index = require('./routesMongo/index');
var users = require('./routes/users');
var customer=require('./routesMongo/customer');
var restaurant=require('./routesMongo/restaurant');
var admin=require('./routesMongo/admin');
var restaurant_owner=require('./routesMongo/restaurant_owner');


var app = express();

//FIREBASE CODE
//Initialize Firebase
// var config = {
//     apiKey: "AIzaSyDW1svOcbk8gC2Mj1KI8DyWaOMmJo-jYOQ",
//     authDomain: "semester5project.firebaseapp.com",
//     databaseURL: "https://semester5project.firebaseio.com",
//     storageBucket: "semester5project.appspot.com",
// };
// firebase.initializeApp(config);
//
// var database = firebase.database();
// function writeUserData(userId, name, email, imageUrl){
//     database.ref('users/' + userId).set({
//         username: name,
//         email: email,
//         profile_picture : imageUrl
//     });
// }
//
// // writeUserData("150050A","Manula","mratapattu@gmail.com","FEK");
// return firebase.database().ref('/users/150050A').once('value').then(function (snapshot) {
//     console.log(snapshot.val().username);
// });

//connect to phpMyAdmin
sqlcon.db.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + sqlcon.db.threadId);
});

//connect to mlab

// const mongoose = require('mongoose');
// let uri = 'mongodb://mratapattu1996:Manula1234@ds115729.mlab.com:15729/bookmytable';
// mongoose.connect(uri);
// let db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));

// //connect to mongoose
// const mongoose = require('mongoose');
// mongoose.connect(mongo.uri);
// let db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// console.log("mongoose connected successfully");
// let songSchema = mongoose.Schema({
//     decade: String,
//     artist: String,
//     song: String,
//     weeksAtOne: Number
// });
//
// // Store song documents in a collection called "songs"
// let Song = mongoose.model('songs', songSchema);
//
// // Create seed data
// let seventies = new Song({
//     decade: '1970s',
//     artist: 'Debby Boone',
//     song: 'You Light Up My Life',
//     weeksAtOne: 10
// });
//
// let eighties = new Song({
//     decade: '1980s',
//     artist: 'Olivia Newton-John',
//     song: 'Physical',
//     weeksAtOne: 10
// });
//
// let nineties = new Song({
//     decade: '1990s',
//     artist: 'Mariah Carey',
//     song: 'One Sweet Day',
//     weeksAtOne: 16
// });

/*
 * First we'll add a few songs. Nothing is required to create the
 * songs collection; it is created automatically when we insert.
 */
//
// let list = [seventies, eighties, nineties]
//
// Song.insertMany(list);

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
