var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    ID:Number,
    firstName:String,
    lastName:String,
    email:String,
    PASSWORD:String,
});
module.exports = mongoose.model('restaurant_owners', userSchema);