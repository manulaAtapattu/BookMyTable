var express = require('express');
var router = express.Router();
const sqlcon = require('./../config/database');


router.get('/register', function(req, res, next) {
    res.render('customers/register', { title: 'Express' });
});

router.get('/', function(req, res, next) {
    res.render('customers/index', { title: 'Express' });
});

router.post("/", function(req, res){
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var mobile=req.body.mobile;


    var sql = "INSERT INTO customers(firstName, lastName, email,mobile) " +
        "VALUES(\"" + firstName + "\", \"" + lastName + "\", \"" + email + "\",\""+mobile+"\");";

    sqlcon.db.query(sql, function(error, result){
        if(error){
            console.log(error);
        } else{
            console.log("Added customer to the database");
        }
        res.redirect("/");
    });
});

router.post("/search",function (req,res) {
    var sql = "SELECT * FROM customers;";

    sqlcon.db.query(sql,function(error,results){
        if(error){
            console.log(error);
        }else {
            res.render("customers/results",{results:results});
        }
    });
});

router.post("/:id/remove",function (req,res) {
    var ID = req.params.id;
    var sql1 = "DELETE FROM customers WHERE ID=\""+ID+"\";";

    sqlcon.db.query(sql1, function(error, result){
        if(error){
            console.log(error);
        } else{
            console.log("Customer successfully removed");
            res.render("customers");
        }
    });
});

router.post("/reservations_made",function (req,res){
    var email = req.session.email;
    var sql = "SELECT * FROM customers WHERE email=\""+email+"\";";

    sqlcon.db.query(sql,function(error,results){
        if(error){
            console.log(error);
        }else {
            res.render("customers/reservations_made",{results:results});
        }
    });
});

module.exports = router;