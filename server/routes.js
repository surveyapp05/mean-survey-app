// Include passport for the route controllers
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

module.exports = function(app, User, Survey) {

    //This route registers the Users
	app.post("/api/register", function(req, res){
        // check mongo for duplicate user data is sent from angular post and found in the req.body
		User.findOne({username: req.body.username}, function(err, user){
            // if user found return json object with status & message
            if(user){
			 	return res.json({
					success: false,
					message: "This user already exists"
				});
            // User is not in mongo db so create a new record in user collection
			} else {
		   		var user = new User();
				user.username = req.body.username;
				user.password = req.body.password;
				user.email = req.body.email;

                // Save to mongo
				user.save(function(err, user){
                    if(err) {
                        console.log(err)
                    } else {
						// User is register so log them in (built in passport function)
                        req.login(user, function(err){
							// Send status and data back to angular
                            if(err) {
                                return res.json({
                                    success: false,
                                    message: "Sorry you have been unable to login at this time, please try again later"
                                });
                            }
                            return res.json({
                                success: true,
                                message: "Registered & logged in!"
                            });
                        });
                    }
				});
			}
		});
	});

	// Passport.js login route (passport.authenticate is a built in passport.js function it checks session id)
    app.post("/api/login", passport.authenticate('local'), function(req, res){
    	res.json(req.user);
	});

	// logs the user out by deleting the cookie (built in passport)
	app.post("/api/logout", function(req, res){
		req.logOut();
		res.json(req.user);
	});

	// checks if user is logged in with correct session ID
    app.post("/api/login-auth",  function(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    })

	// Save a survey to mongodb
	app.post("/api/publish-survey", function(req, res) {
		// New survey model
		var survey = new Survey();
		survey.userID = req.body.userID;
		survey.formData = req.body.elements;
		survey.surveyName = req.body.surveyName;
		survey.results = {};

        // Save to mongo
		survey.save(function(err, survey){
            if(err) {
                console.log(err);
            } else {
                return res.json({
                    success: true,
                    message: "Survey Published!",
					data: survey
                });
            }
		})
	})

	// Find all surveys to display on home page
	app.post("/api/getAllSurveys", function(req, res) {
		// find is empty coz we want all
		Survey.find({}, function(err, surveys){
			if(err) {console.log(err);} else {
				return res.json({
                    success: true,
                    message: "Got Surveys",
					data: surveys
                });
			}
		})
	})

	// Get user surveys to display on their dash page
	app.post("/api/getUsersSurveys", function(req, res) {
		// passing the user id get users created surveys
		Survey.find({userID: req.body.userID}, function(err, surveys){
			if(err) {console.log(err);} else {
				return res.json({
                    success: true,
                    message: "Got Surveys",
					data: surveys
                });
			}
		})
	})

	// get a single survey to display on its view page
	app.post("/api/getSingleSurvey", function(req, res) {
		// passing survey id
		Survey.findOne({_id: req.body.surveyID}, function(err, survey){
			if(err) {console.log(err);} else {
				return res.json({
					success: true,
					message: "Got Survey",
					data: survey
				});
			}
		})
	})

	// save a visiters survey answers
	app.post("/api/saveSurveyResults", function(req, res) {
		// find relevant survey
		Survey.findOne({_id: req.body.surveyID}, function(err, survey){
			if(err) {console.log(err);} else {
				// if no one has submitted answers
				if(!survey.results) {
					// create new result object
					survey.results = {};
					// loop over the survey answers
					Object.keys(req.body.surveyData).forEach(function(key, val) {
						// add to the total number of votes for that option
					  	survey.results[req.body.surveyData[key]] = 1;
					});
					// if already has answers
				} else {
					// loop over the data
					Object.keys(req.body.surveyData).forEach(function(key, val) {
						// if this specific answer has votes
						if(survey.results[req.body.surveyData[key]]) {
							// get the existing votes
							var voteNumber = survey.results[req.body.surveyData[key]];
							// add 1 votes to it
							survey.results[req.body.surveyData[key]] = voteNumber + 1;
							// else it has no votes already
						} else {
							// then add just 1
							survey.results[req.body.surveyData[key]] = 1;
						}
					});
				}
				// update the survey.results with the new values
				Survey.update({_id: req.body.surveyID}, {
				    results: survey.results
				}, function(err, numberAffected, rawResponse) {
					if(err) {
 					   console.log(err);
 				   } else {
 					   return res.json({
 						   success: true,
 						   message: "Survey Saved!",
 						   data: survey.results
 					   });
 				   }
				})
			}
		})
	})

	// get all request and show the angular index.ejs (all client views are through this)
	app.get('*', function(req, res) {
        res.render('pages/index');
    });



    // Passport.js checks the User collection to see if the username and password match
	passport.use('local', new localStrategy(function(username, password, done){
	    User.findOne({username: username, password: password}, function(err, user){
	        if(user){return done(null, user);}
	    	return done(null, false, {message: 'Unable to login'});
	    });
	}));

	passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });



};
