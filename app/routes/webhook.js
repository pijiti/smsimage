var Message            = require('../models/message');
var Image            = require('../models/image');

var config = require('../../config.json');

module.exports = function(app, passport) {
	app.post('/webhook' , function(req , res){

		var secret = req.body.secret;
	    if (secret != config.WEBHOOK_SECRET) {
	        res.status(403).end();
	        return;
	    }
	    if (req.body.event == 'incoming_message') {
	    	var message = new Message();
	    	message.sender_id = req.body.contact_id || '0';
	    	message.sender_number = req.body.from_number || '0';
	    	message.content = req.body.content || '';
	    	message.station_id = extractStationId(message.content);
	    	var failure_reason = validate(message.content);

	    	if(failure_reason){
	    		message.failure_reason = failure_reason;
	    		message.save();
	    		res.json({
	    			messages: [
                        { content: failure_reason }
                    ]
                });
	    		return;
	    	}

	    	message.sender_name = extractSenderName(req.body.content);
	    	message.image_name = extractImageName(req.body.content);

	    	Image.findOne({name : message.image_name} , function(err , image){
	    		if(err || !image){
	    			failure_reason = config.IMAGE_ERROR;
	    			message.failure_reason = failure_reason;
	    			message.save();
	    			res.json({
		    			messages: [
	                        { content: failure_reason }
	                    ]
	                });
	    			return;
	    		}else{
			    	message.displayed_content = message.sender_name;
			    	message.image_url = image.url;
			    	message.status = true;
			    	message.save();
			    	res.json({
		    			messages: [
	                        { content: config.SUCCESS_MESSAGE }
	                    ]
	                });
	                return;
	    		}
	    	})
	    }

	});
}

function validate(sms){

	var correct_compaign_code = checkCompaignCode(sms);
	if(!correct_compaign_code){
		return config.COMPAIGN_ERROR;
	}

	var correct_station_id = checkStationId(sms);
	if(!correct_station_id){
		return config.STATION_ID_ERROR;
	}

	var correct_content_format = checkContentFormat(sms);
	if(!correct_content_format){
		return config.PARAMS_FORMAT_ERROR;
	}

	return false;
}

function checkCompaignCode(sms){
	if(!sms || typeof sms != 'string')
		return false;
	var compaign_code = extractCompaignCode(sms);
	if(compaign_code && config.COMPAIGN_CODE && compaign_code.toLowerCase() == config.COMPAIGN_CODE.toLowerCase()){
		return true;
	}else{
		return false;
	}
}

function checkStationId(sms){
	if(!sms || typeof sms != 'string')
		return false;
	var station_id = extractStationId(sms);
	if(station_id){
		return true;
	}else{
		return false;
	}
}

function checkContentFormat(sms){
	if(!sms || typeof sms != 'string')
		return false;
	var sender_name = extractSenderName(sms);
	var image = extractImageName(sms);
	if(sender_name && image){
		return true;
	}else{
		return false;
	}
}

function extractCompaignCode(sms){
	return sms.split(" ")[0];
}

function extractStationId(sms){
	var parts = sms.split(" ");
	var stations = config.STATIONS || [];
	if(parts && parts.length >= 2 && stations.indexOf(parseInt(parts[1])) >= 0)
		return parts[1];
	return false;
}

function extractSenderName(sms){
	var parts = sms.split(" ");
	if(parts && parts.length >= 3){
		var params = parts[2];
		var name_image = params.split("/");

		if(name_image && name_image.length >= 2){
			return name_image[0];
		}
	}
	return false;
}

function extractImageName(sms){
	var parts = sms.split(" ");
	if(parts && parts.length >= 3){
		var params = parts[2];
		var name_image = params.split("/");

		if(name_image && name_image.length >= 2){
			return name_image[1];
		}
	}
	return false;
}