/*jslint node: true */

var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../models/user');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // Local login
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email) {
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
        }

        // asynchronous
        process.nextTick(function() {
            User.findOne({'local.email':  email}, function(err, user) {
                // if there are any errors, return the error

                if (err) {
                    console.log(err);
                    return done(err);
                }

                if (!user) {
                    console.log('nope');
                    return done(null, false, {message: 'No user found.'});
                }

                if (!user.validPassword(password)) {
                    return done(null, false, {message: 'Wrong Password'});
                }

                // Success
                else {
                    return done(null, user);
                }
            });
        });

    }));

    // LOCAL SIGNUP
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {

        if (email) {
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
        }

        // asynchronous
        process.nextTick(function() {

            // if the user is not already logged in
            if (!req.user) {
                User.findOne({'local.email' :  email}, function(err, user) {

                    if (err) {
                        return done(err);
                    }

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, {message: 'That email is already taken.'});
                    } else {

                        // create the user
                        var newUser            = new User();

                        newUser.local.email    = email;
                        newUser.local.password = newUser.generateHash(password);

                        newUser.save(function(err) {
                            if (err) {
                                return done(err);
                            }

                            return done(null, newUser);
                        });
                    }

                });
            // if the user is logged in but has no local account...
            } else if ( !req.user.local.email ) {
                // ...presumably they're trying to connect a local account
                // BUT let's check if the email used to connect a local account is being used by another user
                User.findOne({'local.email' :  email}, function(err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (user) {
                        return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
                    } else {
                        var tmp_user = req.user;
                        tmp_user.local.email = email;
                        tmp_user.local.password = user.generateHash(password);
                        tmp_user.save(function(err) {
                            if (err) {
                                return done(err);
                            }

                            return done(null, tmp_user);
                        });
                    }
                });
            } else {
                // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                return done(null, false, req.flash('signupMessage', 'You are already logged in.'));
            }

        });

    }));

};
