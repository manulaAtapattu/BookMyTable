var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var timeSlotSchema = new Schema({
    ID:Number,
    AvailableTimeSlots:String,
    ReservedTimeSlots:String
});

module.exports = mongoose.model('restaurant_time_slot', timeSlotSchema);