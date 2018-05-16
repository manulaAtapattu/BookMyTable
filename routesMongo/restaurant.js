var express = require('express');
var router = express.Router();
let uri = 'mongodb://mratapattu1996:Manula1234@ds115729.mlab.com:15729/bookmytable';

const mongoose = require('mongoose');
const fb = require('./../config/firebase');


router.get('/register', function(req, res, next) {
    res.render('restaurants/register', { title: 'Express' });
});

//register a restaurant into the system
router.post("/register", function(req, res){
    var name = req.body.name;
    var location = req.body.location;
    var phone = req.body.phone;
    var roomTable=req.body.roomTable;
    var tableSize=req.body.tableSize;
    var rating="0,0";                       // OverallRating,no.of users
    var ownerID=req.session.ownerID;
    var restaurantNum;
    var restaurantID;


    fb.database.ref('Restaurants').once('value').then(function (snapshot) {
        restaurantNum=snapshot.numChildren();
        restaurantID=parseInt(restaurantNum)+1;
        database.ref('Restaurants/'+restaurantID).set({
            name: name,
            location: location,
            ownerID : ownerID,
            phone:phone,
            rating:rating,
            roomTable:roomTable,
            tableSize:tableSize
        });
    });


        res.render("restaurant_owners");

    // var sql = "INSERT INTO restaurants(name, location, phone,rating,owner_ID) " +
    //     "VALUES(\"" + name + "\", \"" + location + "\", \"" + phone + "\",\""+rating+"\",\""+ownerID+"\");";
    //
    // sqlcon.db.query(sql, function(error, result){
    //     if(error){
    //         console.log(error);
    //     } else{
    //         console.log("Added restaurant to the database");
    //     }
    //     res.render("restaurant_owners");
    // });
});

//show all the restaurants in the system
router.post("/search",function (req,res) {


    var userType=req.session.userType;
    var restaurantID= req.session.restaurant_id;

    fb.database.ref('/Restaurants'+restaurantID).once('value').then(function (snapshot) {
    res.render("restaurants/restaurantReservations",{reservations:snapshot});
});

    // var sql = "SELECT * FROM restaurants;";
    // var userType=req.session.userType;
    //
    // sqlcon.db.query(sql,function(error,results){
    //     if(error){
    //         console.log(error);
    //     }else {
    //         res.render("restaurants/results",{results:results,userType:userType});
    //     }
    // });
});

router.post("/:id/rateRestaurant",function (req,res) {

    var restaurantID = req.params.id;
    req.session.restaurant_id=restaurantID;
    console.log(restaurantID);

    return fb.database.ref('/Restaurants/'+restaurantID).once('value').then(function (snapshot) {
        console.log(snapshot.val());
        res.render("customers/rateRestaurantMongo",{results:snapshot});
    });

    // var sql = "SELECT rating FROM restaurants;";
    // sqlcon.db.query(sql,function(error,results){
    //     if(error){
    //         console.log(error);
    //     }else {
    //         rating=results[0].rating;
    //         res.render("customers/rateRestaurant",{results:results,rating:rating});
    //     }
    // });
});

//update the details of a restaurant
router.post("/update",function (req,res) {

    var name = req.body.name;
    var location = req.body.location;
    var phone = req.body.phone;
    var restaurantID=req.session.restaurant_id;

    //list of updates
    var updates={};
    updates['/'+restaurantID+'/name']=name;
    updates['/'+restaurantID+'/location']=location;
    updates['/'+restaurantID+'/phone']=phone;

    fb.database.ref('/Restaurants').update(updates);
    console.log("restaurant successfully updated")
    req.flash('info','restaurant successfully updated');
    res.render("restaurant_owners");

    // var sql = "UPDATE  restaurants SET name = \""+name+"\",location = \""+location+"\",phone = \""+phone+"\" WHERE ID=\""+restaurantID+"\";";
    //
    // sqlcon.db.query(sql,function(error,results){
    //     if(error){
    //         console.log(error);
    //     }else {
    //         res.render("restaurant_owners");
    //     }
    // });
});

router.post("/:id/reserve",function (req,res) {
    var restaurantID = req.params.id;
    var timeSlots;
    req.session.restaurant_id=req.params.id;

    return fb.database.ref('/Restaurants/'+restaurantID).once('value').then(function (snapshot) {
        console.log(snapshot.val());
        res.render("customers/results_ART_Mongo",{results:snapshot});
    });

    // var sql1 = "SELECT * FROM restaurant_layout WHERE ID=\""+ID+"\";";
    // sqlcon.db.query(sql1, function(error, result){
    //     if(error){
    //         console.log(error);
    //     } else{k
    //         console.log("res_session"+req.session.restaurant_id);
    //         res.render("restaurants/results_ART", {results: result});
    //     }
    // });
});

//after selecting restaurant
router.post("/:id/reserveTS", function(req, res, next) {
    req.session.restaurant_id=req.params.id;
    res.render("restaurants/reserveTS", { title: 'Express' });
});

//after selecting breakfast/lunch/dinner
router.post("/:id/reserveTable",function (req,res) {

    mongoose.connect(uri);
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    var time_slot = req.params.id;
    req.session.time_slot=time_slot;
    var ID = req.session.restaurant_id;
    console.log(ID);

    db.once('open', function () {
        var user = require('./models/restaurantTimeSlotModel.js');
        user.findOne({ID:ID},function (err, results) {
            if (err) return console.error(err);
            console.log(results);
            req.session.RTS=results;
            mongoose.connection.close();
            res.render("restaurants/results_ART_Mongo",{results:results,time_slot:time_slot});
        });
    });

    // var sql1 = "SELECT * FROM restaurant_time_slot WHERE ID=\""+ID+"\";";
    //
    // sqlcon.db.query(sql1, function(error, result){
    //     if(error){
    //         console.log(error);
    //     } else{
    //         req.session.RTS=result;
    //         res.render("restaurants/results_ART", {results: result, time_slot: time_slot});
    //     }
    // });
});

router.post("/:id/final_reserve", function(req, res) {

    mongoose.connect(uri);
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    var room_table = req.params.id;
    var email = req.session.email;
    req.session.RT=room_table;
    var RTS=req.session.RTS;
    console.log("RTS: "+RTS.AvailableTimeSlots);
    var TS = req.session.time_slot;
    var ID = req.session.restaurant_id; //to update reservations_made.ejs in customers

    //remove table from available
    var ATS = RTS.AvailableTimeSlots;
    var ATS2 = ATS.split("/");
    var required_ATS= ATS2[parseInt(TS)-1];
    var required_ATS2 = required_ATS.split(",");
    var index1 = required_ATS2.indexOf(room_table);
    required_ATS2.splice(index1, 1);

    var join1 = required_ATS2.join(",");
    ATS2[parseInt(TS)-1]=join1;
    var join2 = ATS2.join("/");
    console.log("join2: "+join2);
    var Schema = require('./models/restaurantTimeSlotModel.js');

    db.once('open', function () {

        console.log("here1");
        Schema.findOne({ID: ID}, function (err, user) {
            if (err) return console.log("Error: " + err);
            user.set({AvailableTimeSlots: join2});
            user.save(function (err, updatedTimeSlot) {
                if (err) return console.log("error: " + err);
                // res.send(updatedUser);
                console.log("timeSlot successfully updated");

            });
        });
    });

    //////add table to reserved
    var RTS = RTS.ReservedTimeSlots;
    var RTS2 = RTS.split("/");
    var required_RTS= RTS2[parseInt(TS)-1];
    if (required_RTS==""){join3=room_table}
    else if(!required_RTS.indexOf(',') > -1){join3=required_RTS+','+room_table}
    else {
        var required_RTS2 = required_RTS.split(",");
        required_RTS2.push(room_table);
        var join3 = required_RTS2.join(",");
    }
    RTS2[parseInt(TS)-1]=join3;
    var join4 = RTS2.join("/");
    console.log("join4: "+join4);

    db.once('open', function () {
        Schema.findOne({ID:ID},function (err,user) {
            if (err) return console.log("Error: "+err);
            console.log(user);
            user.set({ReservedTimeSlots:join4});
            user.save(function (err,updatedTimeSlot) {
                if(err) return console.log("error: "+err);
                // res.send(updatedUser);
                console.log("updated reserved");
            });
        });
    });

    //////////update reservation in customers
    var RM=req.session.reservations;
    var record = ID+","+TS+","+room_table;
    console.log("RM:"+RM);
    var RM2=RM.split("/");
    RM2.push(record);
    var RM3 = RM2.join("/");
    console.log(RM3);

                            var User = require('./models/customersModel');

                            db.once('open', function () {
                                User.findOne({email:email},function (err,user) {
                                    if (err) return console.log("Error: "+err);
                                    user.set({reservation:RM3});
                                    user.save(function (err,updatedTimeSlot) {
                                        if(err) return console.log("error: "+err);
                                        // res.send(updatedUser);
                                        console.log("updated successfully")
                                    });
                                });
    });

                            var reservations;
                            //update reservations in restaurants
                            fb.database.ref('/Restaurants/'+ID).once('value').then(function (snapshot) {
                                reservations = snapshot.reservations;
                                if (reservations==undefined){reservations=req.session.ownerID+","+TS+","+room_table;}else{reservations=reservations+"/"+req.session.ownerID+","+TS+","+room_table;}
                                console.log("Reservations in restaurant: "+reservations);
                                var updates={};
                                updates['/'+ID+'/reservations']=reservations;
                                fb.database.ref('/Restaurants').update(updates);
                            });


                             req.flash('info','Reservation updated');
                            setTimeout(function(){res.render("customers", { title: 'Express' });},3000);
                            // while (true){
                            //     if (flag1==true){
                            //         if (flag2==true){
                            //             if (flag3==true){
                            //         res.render("customers", { title: 'Express' });
                            //             }else{ console.log("DONE");res.render("customers", { title: 'Express' });}
                            //
                            //             }
                            //     }
                            // }
    // var sql1 = "UPDATE restaurant_time_slot SET Available_time_slots = \""+join2+"\" WHERE ID="+ID+";";
    //
    // sqlcon.db.query(sql1, function(error, result){
    //     if(error){
    //         console.log(error);
    //     } else{
    //         // req.session.RTS=result;
    //         console.log("updated Available")
    //     }
    // });


    // var sql2 = "UPDATE restaurant_time_slot SET Reserved_time_slots = \""+join4+"\" WHERE ID="+ID+";";
    //
    // sqlcon.db.query(sql2, function(error, result){
    //     if(error){
    //         console.log(error);
    //     } else{
    //         // req.session.RTS=result;
    //         console.log("updated Reserved")
    //     }
    // });


    // var sql4 = "UPDATE customers SET reservation= \""+RM3+"\" WHERE email=\""+email+"\";";
    // sqlcon.db.query(sql4, function(error, result){
    //     if(error){
    //         console.log(error);
    //     } else{
    //         // req.session.reservation_made=result;
    //         console.log("updated successfully");
    //     }
    // });
});


module.exports = router;