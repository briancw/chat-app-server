/*jslint node: true */

module.exports = function(app, passport) {

    // Index Get
    app.get('/', home.index );

    app.get('/pwd', is_logged_in, function(req, res) {
        res.send('secret');
    });

    // Check Auth
    app.get('/auth-check', is_logged_in, account.check_auth);

    // Login
    app.post('/login', account.login );

    // Signup
    app.post('/signup', account.signup );

};

function is_logged_in(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    console.log('Auth Failed!');
    res.status(401);
    res.send({error: 'authentication failed'})
    // res.redirect('/auth-failed');
}
