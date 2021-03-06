var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path 	 = require('path')
var config   = require('./config.json')
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

//var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(config.DB_URI); // connect to our database
// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection opened');
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});
require('./config/passport')(passport); // pass passport for configuration
// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.static(path.join(__dirname, 'public')));

//============== Load routes ================//

require('./app/routes/sign.js')(app, passport);
require('./app/routes/admin.js')(app, passport);
require('./app/routes/message.js')(app, passport);
require('./app/routes/webhook.js')(app, passport);
require('./app/routes/upload.js')(app, passport);
require('./app/routes/misc.js')(app);

app.listen(port);
console.log('The magic happens on port ' + port);