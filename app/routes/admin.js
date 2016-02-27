// app/admin.js
var User            = require('../models/user');

module.exports = function(app, passport) {

    app.get('/admin', isLoggedIn , function(req, res) {
        if(req.user && req.user.type == 'station_admin'){
            res.redirect('/message');
            return;
        }
        res.render('admin.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });


    app.post('/admin' , exists , function(req , res){
        var user = new User(req.body);
        user.password = user.generateHash(req.body.password);
        user.type = 'station_admin';
        user.save(function(err , user){
            if(err){
                res.status(500).send(err);
            }else{
                res.status(200).json(user);
            }
        })
    })

    app.get('/adminList' , function(req , res){
        User.find({ 'type' :  'station_admin' }, function(err, users) {
            if(err){
                res.status(500).end();
            }else
                res.status(200).json(users);
        });
    })

    app.put('/admin/:id' , function(req , res){
        User.findOne({ _id :  req.params.id }, function(err, user) {
            if(err){
                res.status(500).end();
            }else if(user){
                user.activated = !req.body.activated;
                user.save(function(err , user){
                    if(err){
                        res.status(500).send(err);
                    }else{
                        res.status(200).json(user);
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

// route middleware to make sure a user is logged in
function exists(req, res, next) {

     User.findOne({ 'email' :  req.body.email }, function(err, user) {
        if(err){
            res.status(500).end();
        }else if(user){
            res.status(403).json({message : "This email already exists"});
        }else{
            next();
        }
     });

}