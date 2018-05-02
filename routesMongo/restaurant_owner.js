var express = require('express');
var router = express.Router();
const sqlcon = require('./../config/database');
const mongoose = require('mongoose');
let uri = 'mongodb://mratapattu1996:Manula1234@ds115729.mlab.com:15729/bookmytable';
const fb = require('./../config/firebase');


/* GET home page. */
router.get('/register', function(req, res, next) {
    res.render('restaurant_owners/register', { title: 'Express' });
});
router.get('/', function(req, res, next) {
    res.render('restaurant_owners/index', { title: 'Express' });
});
//not used???
router.post("/", function(req, res){

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var mobile=req.body.mobile;


    var sql = "INSERT INTO admin(firstName, lastName, email,mobile) " +
        "VALUES(\"" + firstName + "\", \"" + lastName + "\", \"" + email + "\",\""+mobile+"\");";

    sqlcon.db.query(sql, function(error, result){
        if(error){
            console.log(error);
        } else{
            console.log("Added admin to the database");
        }
        res.redirect("/admin");
    });
});

router.post("/:id/editRestaurant",function (req,res) {
    var restaurantID=req.params.id;
    req.session.restaurant_id=restaurantID;

    return fb.database.ref('/Restaurants/'+restaurantID).once('value').then(function (snapshot) {
    console.log(snapshot.val());
    res.render("restaurants/edit",{restaurants:snapshot});
});

    // var sql = "SELECT * FROM restaurants WHERE ID=\""+restaurantID+"\";";
    //
    // sqlcon.db.query(sql,function(error,results){
    //     if(error){
    //         console.log(error);
    //     }else {
    //         res.render("restaurants/edit",{results:results});
    //     }
    // });
});

router.post("/:id/addWaiter", function(req, res, next) {
    req.session.restaurant_id=req.params.id;
    res.render("restaurant_owners/registerW", { title: 'Express' });
});

router.post("/registerW", function(req, res){

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var mobile=req.body.mobile;
    var password="BookMyTable";
    var restaurants="";
    var waiterNo;
    var waiterID;

    fb.database.ref('Waiters').once('value').then(function (snapshot) {
        waiterNo=snapshot.numChildren();
        waiterID=parseInt(waiterNo)+1;
        database.ref('Waiters/'+waiterID).set({
            email: email,
            firstName: firstName,
            lastName : lastName,
            mobile:mobile,
            password:password,
            restaurants:restaurants
        });
        console.log("Added waiter to the database");
    });
    res.redirect("/restaurant_owners");

    // var sql = "INSERT INTO waiters(firstName, lastName, email,mobile,PASSWORD,restaurantList) " +
    //     "VALUES(\"" + firstName + "\", \"" + lastName + "\", \"" + email + "\",\""+mobile+"\",\""+"bookyMyTable123"+"\",\""+""+"\");";
    //
    // sqlcon.db.query(sql, function(error, result){
    //     if(error){
    //         console.log(error);
    //     } else{
    //         console.log("Added waiter to the database");
    //     }
    //     res.redirect("/restaurant_owners");
    // });
});


router.post("/search",function (req,res) {
    var ownerID=req.session.ownerID;
    console.log("OwnerID: "+ownerID);

    return fb.database.ref('/Restaurants').once('value').then(function (snapshot) {
        console.log(snapshot.val());
        res.render("restaurants/resultsNew",{restaurants:snapshot});
    });
    // var sql = "SELECT * FROM restaurants WHERE owner_ID=\""+ownerID+"\";";
    //
    // sqlcon.db.query(sql,function(error,results){
    //     if(error){
    //         console.log(error);
    //     }else {
    //         res.render("restaurants/results",{results:results,userType:userType});
    //     }
    // });
});

//no need?
router.post("/loginValidation", function(req, res){
    var userType = req.body.userType;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var ps=req.body.password;


    var sql1 = "SELECT *  FROM "+ userType+" WHERE email=\'" + firstName + "\' AND lastName=\'"+lastName+"\';";
    // var sql2 = "SELECT * FROM route_stop WHERE Licence=\"" + Licence + "\";";
    // console.log("here");
    sqlcon.db.query(sql1, function(error, password){
        if(error){
            console.log(error);
        } else if((password[0].password)== ps ){
            req.session.ownerID=password[0]
            console.log("Password is correct");
            // res.render("buses/edit", {admin: password[0]});
            res.redirect("/admin");
        }else{
            console.log("Password is incorrect");

        }
    });
});

module.exports = router;