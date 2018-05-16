var express = require('express');
var router = express.Router();
let uri = 'mongodb://mratapattu1996:Manula1234@ds115729.mlab.com:15729/bookmytable';

const mongoose = require('mongoose');
const fb = require('./../config/firebase');

router.get('/', function(req, res) {
    res.render('restaurant_manager/index', { title: 'Express' });
});

router.post("/reservations_made",function (req,res) {

    var restaurantID = req.session.restaurant_id;
    fb.database.ref('/Restaurants' + restaurantID).once('value').then(function (snapshot) {
        console.log(snapshot.val());
        res.render("restaurants/restaurantReservations", {reservations: snapshot});
    });
});

router.post("/:id/cancelReservation",function (req,res){

    mongoose.connect(uri);
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    var reservationID = req.params.id;
    var existingReservation;
    var removedReservation;
    var updatedReservation;
    var currentCustomerReservation;
    var updatedCustomerReservation;
    var customerID;
    var restaurantID=req.session.restaurant_id;

    fb.database.ref('/Restaurants'+restaurantID).once('value').then(function (snapshot) {
        existingReservation=snapshot.reservations;
    });
    var array1=existingReservation.split('/');
    array1.splice(reservationID,1);
    if(array1.length==1){updatedReservation=array1[0];}else if(array1.length==0){updatedReservation=""}else{updatedReservation=array1.join('/');}
    removedReservation=array1[reservationID];
    var array2=removedReservation.split(',');
    customerID=array2[0];
    var customerEntry=restaurantID+','+array2[1]+','+array2[2];


    var updates={};
    updates['/'+reservationID+'/reservations']=updatedReservation;
    fb.database.ref('/Restaurants').update(updates);

    var User = require('./models/customersModel');

    //get current customer reservation
    db.once('open', function () {
        User.findOne({ID:customerID},function (err, results) {
            if (err) return console.error(err);
            currentCustomerReservation=results.reservation;
            mongoose.connection.close();
            console.log("customer received from database")

        });
    });
    if(!currentCustomerReservation.indexOf('/') > -1){
        updatedCustomerReservation="";
    }else{
        var array3=currentCustomerReservation.split('/');
        var index=array3.indexOf(customerEntry);
        if (index > -1) {
            array3.splice(index, 1);
        }
        updatedCustomerReservation=array3.join('/');
    }


    // update customer reservation
    db.once('open', function () {
        User.findOne({email:email},function (err,user) {
            if (err) return console.log("Error: "+err);
            user.set({reservation:updatedCustomerReservation});
            user.save(function (err,updatedCustomerReservation) {
                if(err) return console.log("error: "+err);
                // res.send(updatedUser);
                console.log("Customer reservation updated successfully")
                req.flash('info','Customer reservation updated successfully');

            });
        });
    });

    setTimeout(function(){res.render("reservation_managers", { title: 'Express' });},3000);

    // var sql = "SELECT * FROM customers WHERE email=\""+email+"\";";
    //
    // sqlcon.db.query(sql,function(error,results){
    //     if(error){
    //         console.log(error);
    //     }else {
    //         res.render("customers/reservations_made",{results:results});
    //     }
    // });
});

module.exports = router;