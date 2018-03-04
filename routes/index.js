var express = require('express');
var router = express.Router();
const sqlcon = require('./../config/database');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('Common/login', { title: 'Express' });
});

router.post("/editProfile",function (req,res) {
    var ID=req.session.ownerID;
    var userType=req.session.userType;

    var sql = "SELECT * FROM "+userType+" WHERE ID=\""+ID+"\";";

    sqlcon.db.query(sql,function(error,results){
        if(error){
            console.log(error);
        }else {
            res.render("Common/edit",{results:results});
        }
    });
});

router.post("/updateProfile",function (req,res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var mobile=req.body.mobile;
    var password=req.body.password;

    var ID=req.session.ownerID;
    var userType=req.session.userType;

    var sql = "UPDATE "+userType+" SET firstName = \""+firstName+"\",lastName = \""+lastName+"\",email = \""+email+"\",mobile = \""+mobile+"\",PASSWORD = \""+password+"\" WHERE ID="+ID+";";

    sqlcon.db.query(sql,function(error,results){
        if(error){
            console.log(error);
        }else {
            if (userType=="admin"){userType+="s"}
            res.render(userType);
        }
    });
});

router.post("/loginValidation", function(req, res){
    var userType = req.body.userType;
    var email = req.body.email;
    var ps=req.body.password;

    req.session.email=req.body.email;
    req.session.userType=userType;

    var sql1 = "SELECT * FROM "+ userType+" WHERE email=\'" + email +"\';";
    // var sql2 = "SELECT * FROM route_stop WHERE Licence=\"" + Licence + "\";";
    // console.log("here");
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
});

module.exports = router;
