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
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var mobile=req.body.mobile;


    var sql = "INSERT INTO admin(firstName, lastName, email,mobile,PASSWORD) " +
        "VALUES(\"" + firstName + "\", \"" + lastName + "\", \"" + email + "\",\""+mobile+"\",\""+"BookMyTable1234"+"\");";

    sqlcon.db.query(sql, function(error, result){
        if(error){
            console.log(error);
        } else{
            console.log("Added admin to the database");
        }
        res.redirect("/admin");
    });
});

router.post("/registerRO", function(req, res){
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var mobile=req.body.mobile;


    var sql = "INSERT INTO restaurant_owners(firstName, lastName, email,mobile,PASSWORD) " +
        "VALUES(\"" + firstName + "\", \"" + lastName + "\", \"" + email + "\",\""+mobile+"\",\""+"bookyMyTable123"+"\");";

    sqlcon.db.query(sql, function(error, result){
        if(error){
            console.log(error);
        } else{
            console.log("Added Restaurant Owner to the database");
        }
        res.redirect("/admin");
    });
});







module.exports = router;