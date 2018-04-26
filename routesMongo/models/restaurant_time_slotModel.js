var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var timeSlotSchema = new Schema({
    ID:Number,
    Available_time_slots:String,
    Reserved_time_slots:String,
});
module.exports = mongoose.model('restaurant_time_slot', timeSlotSchema);