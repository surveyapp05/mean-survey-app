// designing a model for mongo
var mongoose = require('mongoose');

var surveySchema = mongoose.Schema({
    userID: String, // user ID of surveys creator
    surveyName: String, // user ID of surveys creator 
    formData: {}, // object of form elements {label: {inputType:list}} eg. {'favourite color': {'radio':'blue','green','red'} }
    results: {} //  object of results {label:answer} eg. {'favourite color':'blue'}
});

// create the model and expose it to our app with module.exports
module.exports = mongoose.model('Survey', surveySchema);
