// app/admin.js
var Message            = require('../models/message');

module.exports = function(app, passport) {
	app.get('/messageList' , isLoggedIn , function(req , res){
		var query = req.user && req.user.type == 'station_admin' ? {station_id : req.user.station_id} : {};
		Message.find(query , function(err , messages){
			if(err){
				res.status(500).send();
			}else{
				res.status(200).json(messages);
			}
		})
	});

	app.get('/message' , isLoggedIn , function(req , res){
		res.render('messages.ejs')
	});

	app.put('/message/:id' , function(req , res){
        Message.findOne({ _id :  req.params.id }, function(err, message) {
            if(err){
                res.status(500).end();
            }else if(message){
                message.activated = req.body.activated;
                message.save(function(err , m){
                    if(err){
                        res.status(500).send(err);
                    }else{
                        res.status(200).json(m);
                    }
                })
            }
        });
    })
    
    
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
