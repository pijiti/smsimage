
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var imageSchema = mongoose.Schema({
        name : String,
        url  : String,
        station_id : String,
        data : Object
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Image', imageSchema);