
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var messageSchema = mongoose.Schema({
        sender_id:String , 
        sender_number: String ,
        sender_name : String,
        content:String ,
        image_name : String,
        station_id : String,
        displayed_content : String,
        created_at : {type : Date , default : Date.now},
        sent_at : {type : Date},
        status:{type : Boolean, default : false},
        activated : {type : String , default : 'reset'},
        sent:{type : Boolean , default : false},
        failure_reason:String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Message', messageSchema);