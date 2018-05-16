const mongoose = require('mongoose');
let uri = 'mongodb://mratapattu1996:Manula1234@ds115729.mlab.com:15729/bookmytable';


var express = require('express');
var router = express.Router();
const fb = require('./../config/firebase');



router.get('/register', function(req, res, next) {
    res.render('customers/register', { title: 'Express' });
});

router.get('/', function(req, res, next) {
    res.render('customers/index', { title: 'Express' });
});

// do i need this
router.post("/", function(req, res){

    mongoose.connect(uri);
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var mobile=req.body.mobile;
    var Max;

    db.once('open',function () {
        var User = require('./models/customersModel.js');
        User.findOne().sort('-ID').exec(function (err,max) {
            Max=parseInt(max.ID)+1;
            console.log("MaxID="+Max);
            var newCustomer= new User({ID:Max,firstName:firstName,lastName:lastName,email:email,mobile:mobile,PASSWORD:"bookmytable"});
            newCustomer.save(function (err, newCustomer) {
                if (err) return console.error(err);
                console.log("new customer - "+newCustomer+" successfully added");
            });
            req.flash('info','Customer added successfully');
            res.redirect("/");
        });
    });



    // var sql = "INSERT INTO customers(firstName, lastName, email,mobile) " +
    //     "VALUES(\"" + firstName + "\", \"" + lastName + "\", \"" + email + "\",\""+mobile+"\");";
    //
    // sqlcon.db.query(sql, function(error, result){
    //     if(error){
    //         console.log(error);
    //     } else{
    //         console.log("Added customer to the database");
    //     }
    //     res.redirect("/");
    // });
});

router.post("/customerRegistration", function(req, res){
    mongoose.connect(uri);
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var mobile=req.body.mobile;
    var Max;
    var User = require('./models/customersModel.js');

    db.once('open',function () {
        User.findOne().sort('-ID').exec(function (err,max) {
            Max=parseInt(max.ID)+1;
            console.log("MaxID="+Max);
            var newCustomer= new User({ID:Max,firstName:firstName,lastName:lastName,email:email,mobile:mobile,PASSWORD:"bookmytable"});
            newCustomer.save(function (err, newCustomer) {
                if (err) return console.error(err);
                console.log("new customer - "+newCustomer+" successfully added");
            });
            req.flash('info','Customer added successfully');
            res.redirect("/");
        });
    });

    // var sql = "INSERT INTO restaurant_owners(firstName, lastName, email,mobile,PASSWORD) " +
    //     "VALUES(\"" + firstName + "\", \"" + lastName + "\", \"" + email + "\",\""+mobile+"\",\""+"bookyMyTable123"+"\");";
    //
    // sqlcon.db.query(sql, function(error, result){
    //     if(error){
    //         console.log(error);
    //     } else{
    //         console.log("Added Restaurant Owner to the database");
    //     }
    //     res.redirect("/admin");
    // });
});
router.post("/search",function (req,res) {

    mongoose.connect(uri);
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    var User = require('./models/customersModel.js');
    db.once('open',function () {
        User.find(function (err, users) {
            if (err) return console.error(err);
            console.log(users);
            res.render("customers/resultsMongo",{customers:users});
        });
    });

    //  iterate restaurants in firebase
//     var restaurantNumber;
//     var names;
//     var locations;

//     return fb.database.ref('/Restaurants').once('value').then(function (snapshot) {
//     console.log(snapshot.val());
//     for(var i=1;i<snapshot.numChildren()+1;i++){
//         console.log(snapshot.child(i).child("name").val());
//         console.log(snapshot.child(i).child("location").val());
//
//     }
// });

    // var sql = "SELECT * FROM customers;";
    //
    // sqlcon.db.query(sql,function(error,results){
    //     if(error){
    //         console.log(error);
    //     }else {
    //         res.render("customers/results",{results:results});
    //     }
    // });
});

router.post("/:id/remove",function (req,res) {

    mongoose.connect(uri);
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    var ID = req.params.id;
    var User = require('./models/customersModel.js');

    db.once('open',function () {
        User.remove({ID:ID},function (err, users) {
            if (err) return console.error(err);
            console.log("Customer removed from database");
            req.flash('info','Customer removed successfully');
            res.redirect("/admin");
        });
    });
    // var sql1 = "DELETE FROM customers WHERE ID=\""+ID+"\";";
    //
    // sqlcon.db.query(sql1, function(error, result){
    //     if(error){
    //         console.log(error);
    //     } else{
    //         console.log("Customer successfully removed");
    //         res.render("customers");
    //     }
    // });
});

router.post("/recordRating",function (req,res) {

    var rating = req.body.rating;
    var overallRating = req.body.overallRating;
    var restaurantID=req.session.restaurant_id;
    var userNumber = req.body.userNumber;
    var newRating;
    var finalRating ;

    console.log(rating+','+userNumber+','+overallRating);
    newRating=((parseFloat(overallRating)*parseFloat(userNumber))+parseFloat(rating))/(parseFloat(userNumber)+1.00);               // Calculating new overall rating
    userNumber=parseInt(userNumber)+1;                                          //updating the user Number
    finalRating=newRating.toString()+","+userNumber .toString();

    //rating stored in firebase database
    var updates={};
    updates['/'+restaurantID+'/rating']=finalRating;
    fb.database.ref('/Restaurants').update(updates);
    console.log("rating successfully recorded")
    req.flash('info','rating recorded successfully');
    res.render("customers");

    // var sql = "UPDATE restaurants SET rating = \""+finalRating+"\" WHERE ID="+restaurantID+";";
    //
    // sqlcon.db.query(sql,function(error,results){
    //     if(error){
    //         console.log(error);
    //     }else {
    //         console.log("rating successfully recorded")
    //         res.render("customers");
    //     }
    // });
});


router.post("/reservations_made",function (req,res){

    mongoose.connect(uri);
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    var ID = req.session.ownerID;
    console.log("ID: "+ID);
    var User = require('./models/customersModel.js');

    db.once('open',function () {
        User.findOne({ID:ID},function (err, user) {
            if (err) return console.error(err);
            console.log(user);
            res.render("customers/reservations_madeMongo",{reservations:user.reservation});
        });
    });


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