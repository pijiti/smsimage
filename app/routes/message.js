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
    
    
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
