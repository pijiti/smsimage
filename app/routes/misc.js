var Message            = require('../models/message');
var config = require('../../config.json');
var path = require('path')
var childProcess = require('child_process')
var phantomjs = require('phantomjs-prebuilt')
var binPath = phantomjs.path
var jsonfile = require('jsonfile');

module.exports = function(app){

	app.get('/json/:id/data.json' , function(req , res , next){
	  var file = req.params.id + '.json';
	  jsonfile.readFile(file, function(err, obj) {
	    if(err) res.json({});
	    else res.json(obj);
	  })
	})

	function submit(){
		Message.findOne({status : true , sent : false , activated : 'active'} , function(err , message){
			
			if(message){
				console.log(message);
				message.sent = true;
				message.save(function(err , m){
					if(err) console.log(err);
					else {
						var file = './' + message.station_id +'.json';

		                var obj = {'name':message.sender_name , 'url' : message.image_url};
		                jsonfile.writeFileSync(file, obj);
						submitForm(message);
					}
				});
			}else{
				var stations = config.STATIONS || [];
				for(var i=0; i < stations.length ; i++){
					var file = './' + stations[i] +'.json';
	                var obj = {};
	                jsonfile.writeFileSync(file, obj);
				}
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