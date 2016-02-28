var Message            = require('../models/message');
var config = require('../../config.json');
var path = require('path')
var childProcess = require('child_process')
var phantomjs = require('phantomjs-prebuilt')
var binPath = phantomjs.path

module.exports = function(app){
	function submit(){
		Message.findOne({status : true , sent : false , activated : 'active'} , function(err , message){
			if(err) console.log(err);
			else if(message){
				console.log(message);
				message.sent = true;
				message.save();

				submitForm(message);
			}
		})
	}

	var submitForm = function(data){
   
	    var controlArgs = [
	        path.join(__dirname, 'phantom/phantomjs-control.js'),
	        config.USERNAME , config.PASSWORD , data.station_id , config.EVENT
	    ]

	    var control = childProcess.execFile(binPath, controlArgs, function(err, stdout, stderr) {
	      
	    })

	    control.stdout.on('data', function(data) {
	        console.log('stdout: ' + data);
	    });
	    control.stderr.on('data', function(data) {
	        console.log('stderr: ' + data);
	    });
	    control.on('close', function(code) {
	        console.log('closing code: ' + code);
	    });
	}

	setInterval(function(){
	    submit();
	} , config.DELAY)
}