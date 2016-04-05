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
		req.logOut()
		res.json(req.user);
	});

    app.post("/api/login-auth",  function(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    })



    //This registers the Users
	app.post("/api/register", function(req, res){
        // check mongo for duplicate user
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
                        return res.json({
        					success: false,
        					message: "user registered",
                            data: user
        				});
                    }
				});
			}
		});
	});



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