/*jslint node: true */

module.exports = function(app, passport) {

    // Index Get
    app.get('/', home.index );

    app.get('/pwd', is_logged_in, function(req, res) {
        res.send('secret');
    });

    // Login
    app.post('/login', account.login );

    // Signup
    app.post('/signup', account.signup );

};

function is_logged_in(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    console.log('redir!');
    res.redirect('/');
}
