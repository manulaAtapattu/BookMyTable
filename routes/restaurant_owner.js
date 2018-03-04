var express = require('express');
var router = express.Router();
const sqlcon = require('./../config/database');


/* GET home page. */
router.get('/register', function(req, res, next) {
    res.render('restaurant_owners/register', { title: 'Express' });
});
router.get('/', function(req, res, next) {
    res.render('restaurant_owners/index', { title: 'Express' });
});

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

router.post("/:id/addWaiter", function(req, res, next) {
    req.session.restaurant_id=req.params.id;
    res.render("restaurant_owners/registerW", { title: 'Express' });
});

router.post("/registerW", function(req, res){
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var mobile=req.body.mobile;


    var sql = "INSERT INTO waiters(firstName, lastName, email,contactInfo,PASSWORD,restaurantList) " +
        "VALUES(\"" + firstName + "\", \"" + lastName + "\", \"" + email + "\",\""+mobile+"\",\""+"bookyMyTable123"+"\",\""+""+"\");";

    sqlcon.db.query(sql, function(error, result){
        if(error){
            console.log(error);
        } else{
            console.log("Added waiter to the database");
        }
        res.redirect("/restaurant_owners");
    });
});



router.post("/search",function (req,res) {
    var ownerID=req.session.ownerID;
    var userType=req.session.userType;
    console.log("OwnerID: "+ownerID);
    var sql = "SELECT * FROM restaurants WHERE owner_ID=\""+ownerID+"\";";

    sqlcon.db.query(sql,function(error,results){
        if(error){
            console.log(error);
        }else {
            res.render("restaurants/results",{results:results,userType:userType});
        }
    });
});

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