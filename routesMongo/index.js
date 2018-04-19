var express = require('express');
var router = express.Router();
const sqlcon = require('./../config/database');
let uri = 'mongodb://mratapattu1996:Manula1234@ds115729.mlab.com:15729/bookmytable';

//////

const mongoose = require('mongoose');



router.post("/loginValidation", function(req, res) {

    mongoose.connect(uri);
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    var userType = req.body.userType;
    var email = req.body.email;
    var ps = req.body.password;
    console.log("HEREe");

    req.session.email = req.body.email;
    req.session.userType = userType;

    db.once('open', function () {

        //cannot write model here as overwriteModelError comes/ therefore require global model externally
        var user = require('./models/'+userType+'Model.js');

        user.findOne({email: email}, 'ID firstName lastName email mobile PASSWORD', function (err, User) {
            console.log(User.PASSWORD);
            req.session.ownerID=User.ID;
            req.session.firstName=User.firstName;
            req.session.lastName=User.lastName;
            req.session.email=User.email;
            req.session.mobile=User.mobile;
            req.session.PASSWORD=User.PASSWORD;


            mongoose.connection.close();
            if (User.PASSWORD==ps){
                console.log("Password is correct");
                res.redirect("/" + userType);
            }else{
                console.log("Password is incorrect");
                 res.render('Common/login', {title: 'Express'});
            }
        })
    });
});
        //////////sql code
        /*
        var sql1 = "SELECT * FROM "+ userType+" WHERE email=\'" + email +"\';";
        sqlcon.db.query(sql1, function(error, result){
            if(userType=='customers'){
                req.session.reservations=result[0].reservation;
            }
            if(error){
                console.log(error);
            } else if((result[0].PASSWORD)== ps ){
                req.session.ownerID=result[0].ID;
                console.log("ID-session"+req.session.email);
                console.log("Password is correct");
                res.redirect("/"+userType);
            }else{
                console.log("Password is incorrect");
                res.render('Common/login', { title: 'Express' });
            }
        });
        */


////////////////////////


    /* GET home page. */
    router.get('/', function (req, res, next) {
        res.render('Common/login', {title: 'Express'});
    });

    router.post("/editProfile", function (req, res) {

        console.log("mongoEdit");

        var userType = req.session.userType;
        var firstName=req.session.firstName;
        var lastName=req.session.lastName;
        var email=req.session.email;
        var mobile=req.session.mobile;
        var PASSWORD=req.session.PASSWORD;

        console.log(userType);

        res.render("Common/editMongo",{firstName:firstName,lastName:lastName,email:email,mobile:mobile,PASSWORD:PASSWORD})

        // var sql = "SELECT * FROM " + userType + " WHERE ID=\"" + ID + "\";";
        //
        // sqlcon.db.query(sql, function (error, results) {
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         res.render("Common/edit", {results: results});
        //     }
        // });
    });

    router.post("/updateProfile", function (req, res) {
        mongoose.connect(uri);
        let db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));

        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var email = req.body.email;
        var mobile = req.body.mobile;
        var password = req.body.password;

        var ID = req.session.ownerID;
        var userType = req.session.userType;

        db.once('open', function () {
            var User = require('./models/'+userType+'Model.js');
            User.findOne({ID:ID},function (err,user) {
                if (err) return console.log("Error: "+err);
                user.set({firstName:firstName,lastName:lastName,email:email,mobile:mobile,PASSWORD:password});
                user.save(function (err,updatedUser) {
                    if(err) return console.log("error: "+err);
                    // res.send(updatedUser);

                    //update session fields
                    req.session.firstName=firstName;
                    req.session.lastName=lastName;
                    req.session.email=email;
                    req.session.mobile=mobile;
                    req.session.PASSWORD=password;
                    console.log("profile successfully updated")
                });
            });

            if (userType == "admin") {
                userType += "s"
            }
            console.log("here2");
            res.render(userType);
        });

            // var sql = "UPDATE " + userType + " SET firstName = \"" + firstName + "\",lastName = \"" + lastName + "\",email = \"" + email + "\",mobile = \"" + mobile + "\",PASSWORD = \"" + password + "\" WHERE ID=" + ID + ";";
        //
        // sqlcon.db.query(sql, function (error, results) {
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         if (userType == "admin") {
        //             userType += "s"
        //         }
        //         console.log("profile successfully updated")
        //         res.render(userType);
        //     }
        // });
    });



module.exports = router;