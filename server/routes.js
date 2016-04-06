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
                        req.login(user, function(err){
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

	// logs the user out by deleting the cookie
	app.post("/api/logout", function(req, res){
		req.logOut();
		res.json(req.user);
	});

    app.post("/api/login-auth",  function(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    })

	app.post("/api/publish-survey", function(req, res) {
		var survey = new Survey();
		survey.userID = req.body.userID;
		survey.formData = req.body.elements;
		survey.surveyName = req.body.surveyName;
		survey.results = {};

        // Save to mongo
		survey.save(function(err, user){
            if(err) {
                console.log(err);
            } else {
                return res.json({
                    success: true,
                    message: "Survey Published!"
                });
            }
		})
	})

	app.post("/api/getAllSurveys", function(req, res) {
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

	app.post("/api/getUsersSurveys", function(req, res) {
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

	app.post("/api/getSingleSurvey", function(req, res) {
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

	app.post("/api/saveSurveyResults", function(req, res) {
		console.log(req.body.surveyData);
		Survey.findOne({_id: req.body.surveyID}, function(err, survey){
			//survey.results = survey.results || {};
			if(err) {console.log(err);} else {
				if(!survey.results) {
					survey.results = {};
					Object.keys(req.body.surveyData).forEach(function(key, val) {
					  	survey.results[req.body.surveyData[key]] = 1;
					});
				} else {
					Object.keys(req.body.surveyData).forEach(function(key, val) {
						if(survey.results[req.body.surveyData[key]]) {
							var voteNumber = survey.results[req.body.surveyData[key]];
							survey.results[req.body.surveyData[key]] = voteNumber + 1;
						} else {
							survey.results[req.body.surveyData[key]] = 1;
						}
					});
				}
				console.log(survey);
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
