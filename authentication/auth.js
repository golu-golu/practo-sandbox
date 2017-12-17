var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var user = require('../models/user');

passport.serializeUser(function (u, done) {
	done(null, u.id);
});

passport.deserializeUser(function (id, done) {
	user.User.findById(id, function (err, u) {
		done(err, u);
	});
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		console.log("In login function: " + username + " - " + password);
		user.User.findOne({ phone: username }, function (err, u) {
			if (err) { return done(err); }
			if (!u) {
				console.log("auth1");
				return done(null, false, { message: 'Phone No. Not Registered' });
			}
			if (u) {
				if (password == u.passwd) {
					console.log("auth2");
					return done(null, u);
				}
				else {
					console.log("auth3");
					return done(null, false, { message: 'Incorrect password.' });
				}
			}
		});
	})
);