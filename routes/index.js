var express = require('express');
var router = express.Router();
const sqlcon = require('./../config/database');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('Common/login', { title: 'Express' });
});

router.post("/loginValidation", function(req, res){
    var userType = req.body.userType;
    var email = req.body.email;
    var ps=req.body.password;

    req.session.email=req.body.email;

    var sql1 = "SELECT * FROM "+ userType+" WHERE email=\'" + email +"\';";
    // var sql2 = "SELECT * FROM route_stop WHERE Licence=\"" + Licence + "\";";
    // console.log("here");
    sqlcon.db.query(sql1, function(error, password){
        if(userType=='customers'){
           req.session.reservations=password[0].reservation;

        }
        if(error){
            console.log(error);
        } else if((password[0].PASSWORD)== ps ){
            console.log("ID-session"+req.session.email);
            console.log("Password is correct");
            // res.render("buses/edit", {admin: password[0]});
            res.redirect("/"+userType);
        }else{
            console.log("Password is incorrect");

        }
    });
});

module.exports = router;
