var cloudinary = require('cloudinary');
var config = require('../../config.json');
var path = require('path');
var multer  = require('multer');
var Image            = require('../models/image');
var Message            = require('../models/message');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})
 
var upload = multer({ storage: storage })
cloudinary.config({ 
  cloud_name: config.CLOUDINARY_CLOUD_NAME ,
  api_key: config.CLOUDINARY_API_KEY , 
  api_secret: config.CLOUDINARY_API_SECRET
});

module.exports = function(app , passport){

	app.get('/upload' , function(req , res){
		var user = {};
		if(req.isAuthenticated())
		{
			res.render('upload.ejs');
			return;
		}

		res.render('user-upload.ejs');
	})

	app.get('/imageList' , function(req , res){
		if(!req.isAuthenticated()){
			res.send([]);
			return;
		}

		Image.find(function(err,data){
		    if(err) console.log(err);
		    else {
		      res.send(data);
		    }
		});
	});

	app.delete('/images/:id' , function(req,res){
	  Image.remove({ _id: req.params.id }, function(err) {
	    if (err) {
	      res.status(500).end()
	    }
	    else {
	      res.status(200).end();
	    }
	  });
	});

	app.post('/upload' , upload.single('file')  ,function(req , res){
		cloudinary.uploader.upload(req.file.path , { width: 150, height: 150, 
                   crop: 'thumb', gravity: 'face', radius: 'max' } , function(result){
			console.log(result);
			var img = new Image({url : result.url , name : req.body.name.toLowerCase() , data : result});
			img.save(function(err , data){
			    if (err) {
			    	console.log(err);
			    	res.status(500).end(err);
			    }
			    else {
			    	res.json(data);
			    }
			 });
		});
	})

	app.post('/userUpload' , upload.single('file')  ,function(req , res){

		var stations = config.STATIONS || [];
		if(!req.body.station_id || stations.indexOf(parseInt(req.body.station_id)) < 0){
			res.status(500).json({message : "Station Id does not exist"});
			return;
		}
		cloudinary.uploader.upload(req.file.path , { width: config.IMAGE_WIDTH || 150, height: config.IMAGE_HEIGHT || 150, 
                   crop: 'thumb', gravity: 'face', radius: 'max' } , function(result){
			console.log(result);
			var img = new Image({url : result.url , name : req.body.name.toLowerCase() , data : result});
			img.save(function(err , data){
			    if (err) {
			    	console.log(err);
			    	res.status(500).end(err);
			    }
			    else {
			    	var message = new Message();
			    	message.sender_name = req.body.name;
			    	message.station_id = req.body.station_id;
			    	message.image_name = data.name;
			    	message.image_url = data.url;
			    	message.status = true;
			    	message.save();
			    	res.json(data);
			    }
			});


		});
	})
}
