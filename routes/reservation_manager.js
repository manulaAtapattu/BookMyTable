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
