var firebase = require("firebase");

var config = {
    apiKey: "AIzaSyDW1svOcbk8gC2Mj1KI8DyWaOMmJo-jYOQ",
    authDomain: "semester5project.firebaseapp.com",
    databaseURL: "https://semester5project.firebaseio.com",
    storageBucket: "semester5project.appspot.com",
};

const connection = firebase.initializeApp(config);
const db = connection.database();

exports.database=db;