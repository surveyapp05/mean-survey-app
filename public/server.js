// Include node modules
var express         = require('express');
var app             = express();
var mongoose        = require('mongoose');
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var session         = require ('express-session');
var passport        = require('passport');

// Include Database model instances
var User = require(__dirname + '/server/models/user');
var Survey = require(__dirname + '/server/models/survey');

// DB configuration
var configDB = require('./config/database.js'); // require config.js file
mongoose.connect(configDB.url); // connect to our database

// Set Port
app.set('port', (process.env.PORT || 5004)); // found at http://localhost:5004

// Set up Passport.js
app.use(session({secret: 'this is the secret'}));
app.use(cookieParser('this is the secret'));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public')); // Set user visible directory

app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

// views is directory for main index page
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs'); // set ejs as template engine.

// routes ==================================================
require(__dirname + '/server/routes')(app, User, Survey); // Send the express app and mongo collections to routes.js

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
