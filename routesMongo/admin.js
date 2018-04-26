const mongoose = require('mongoose');


let uri = 'mongodb://mratapattu1996:Manula1234@ds115729.mlab.com:15729/bookmytable';


/////////////////////////////////////////////////////////

var express = require('express');
var router = express.Router();
const sqlcon = require('./../config/database');


/* GET home page. */
router.get('/registerRO', function(req, res, next) {
    res.render('admins/registerRO', { title: 'Express' });
});

router.get('/registerAdmin', function(req, res, next) {
    res.render('admins/registerAdmin', { title: 'Express' });
});



router.get('/', function(req, res, next) {
    res.render('admins/index', { title: 'Express' });
});

router.post("/registerAdmin", function(req, res){

    mongoose.connect(uri);
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var mobile=req.body.mobile;
    var userType = req.session.userType;
    var Max;

    db.once('open',function () {
        var User = require('./models/'+userType+'Model.js');
        User.findOne().sort('-ID').exec(function (err,max) {
            Max=parseInt(max.ID)+1;
            console.log("MaxID="+Max);
            var newAdmin= new User({ID:Max,firstName:firstName,lastName:lastName,email:email,mobile:mobile,PASSWORD:"bookmytable"});
            newAdmin.save(function (err, newAdmin) {
                if (err) return console.error(err);
                console.log("new Admin - "+newAdmin+" successfully added");
            });
            res.redirect("/admin");
        });
    });

    // var sql = "INSERT INTO admin(firstName, lastName, email,mobile,PASSWORD) " +
    //     "VALUES(\"" + firstName + "\", \"" + lastName + "\", \"" + email + "\",\""+mobile+"\",\""+"BookMyTable1234"+"\");";
    //
    // sqlcon.db.query(sql, function(error, result){
    //     if(error){
    //         console.log(error);
    //     } else{
    //         console.log("Added admin to the database");
    //     }
    //     res.redirect("/admin");
    // });
});

router.post("/registerRO", function(req, res){
    mongoose.connect(uri);
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var mobile=req.body.mobile;
    var Max;
    var User = require('./models/restaurant_ownersModel.js');

    db.once('open',function () {
        User.findOne().sort('-ID').exec(function (err,max) {
            Max=parseInt(max.ID)+1;
            console.log("MaxID="+Max);
            var newRO= new User({ID:Max,firstName:firstName,lastName:lastName,email:email,mobile:mobile,PASSWORD:"bookmytable"});
            newRO.save(function (err, newRO) {
                if (err) return console.error(err);
                console.log("new Admin - "+newRO+" successfully added");
            });
            res.redirect("/admin");
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



module.exports = router;