/*jslint node: true */

module.exports = function(passport) {

    var real_exports = {

        login: function(req, res) {
            passport.authenticate('local-login', function(err, user, info) {
                if (err) {
                    res.send( err );
                    res.end();
                    return false;
                }

                if (info) {
                    console.log(info);
                    res.status(400);
                    res.send( info );
                    res.end();
                    return false;
                }

                if (user) {
                    console.log('Authed Creds');

                    req.logIn(user, function(err) {
                        if (err) {
                            return err;
                        }

                        res.send( {success: true} );
                    });

                }

            })(req, res);
        },

        signup: function(req, res) {
            passport.authenticate('local-signup', function(err, user, info) {

                if (err) {
                    res.send( JSON.stringify(err) );
                    res.end();
                    return false;
                }

                if (info) {
                    console.log(info);
                    res.end();
                }

                if (user) {
                    console.log('Created User');
                }

            })(req, res);
        },

        check_auth: function(req, res) {
            res.send( {success: true} );
        }

    };

    return real_exports;

};
