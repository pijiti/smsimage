var cloudinary = require('cloudinary');
var config = require('../../config.json');
var path = require('path');
var multer  = require('multer');
var Image            = require('../models/image');

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
		res.render('upload.ejs')
	})

	app.post('/upload' , upload.single('file') , function(req , res){
		cloudinary.uploader.upload(req.file.path , function(result){
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
}