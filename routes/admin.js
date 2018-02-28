var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/register', function(req, res, next) {
    res.render('admins/register', { title: 'Express' });
});
router.get('/', function(req, res, next) {
    res.render('admins/index', { title: 'Express' });
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

router.get("/buses/:id/edit", function(req, res){
    var Licence = req.params.id;

    var sql1 = "SELECT * FROM admin WHERE Licence=\"" + Licence + "\";";
    // var sql2 = "SELECT * FROM route_stop WHERE Licence=\"" + Licence + "\";";

    db.query(sql1, function(error, buses){
        if(error){
            console.log(error);
        } else{
            res.render("admins/edit", {bus: buses[0]});
        }
    });
});

router.post("/loginValidation", function(req, res){
    var userType = req.body.userType;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var ps=req.body.password;
    // console.log("Hello"+userType);

    //STOPPED HERE 1/21/2018-11.13PM
    //SELECT password FROM admin WHERE firstName=
    //STOPPED HERE on 1/25/2018-8.13 pm -

    var sql1 = "SELECT password FROM "+ userType+" WHERE firstName=\'" + firstName + "\' AND lastName=\'"+lastName+"\';";
    // var sql2 = "SELECT * FROM route_stop WHERE Licence=\"" + Licence + "\";";
    // console.log("here");
    sqlcon.db.query(sql1, function(error, password){
        if(error){
            console.log(error);
        } else if((password[0].password)== ps ){
            console.log("Password is correct");
            // res.render("buses/edit", {admin: password[0]});
            res.redirect("/admin");
        }else{
            console.log("Password is incorrect");

        }
    });
});

module.exports = router;