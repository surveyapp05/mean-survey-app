// designing a model for mongo
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    name: String,
    cookieID: String, // passport cookie 
    relatedSurveys: {}, // object of survey id's
    isAdmin: Boolean // true means user is admin
});

// create the model and expose it to our app with module.exports
module.exports = mongoose.model('User', userSchema);
