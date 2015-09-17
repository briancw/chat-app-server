/*jslint node: true */

var express  = require('express');
var app      = express();
var port     = 9001;
var mongoose = require('mongoose');

var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var flash    = require('connect-flash');
var session  = require('express-session');
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 9005});

var db_config = require('./config/database.js');
mongoose.connect(db_config.url);

require('./config/passport')(passport); // Load passport auth strategies and config

// Configure Express
// app.set('view engine', 'ejs');
app.set('views', 'views/');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'ThisIsARandomStringWithTheNumber42InIt', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Load Controllers
global.home = require('./controllers/home.js');
global.account = require('./controllers/account.js')(passport);

// Load routes
require('./routes.js')(app, passport);

// Fire on all cylinders
app.listen(port);
console.log('Listening on port ' + port);

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {

        try {
            var parsed_message = JSON.parse(message);
            var message_type = parsed_message.type;
        } catch (err) {
            console.log('Invalid client request json');
            console.log(err);
            return false;
        }

        switch (message_type) {

            case 'hello':
                console.log('got a hello!');
                var client_count = wss.clients.length;

                break;

            default:
                console.log('Unkown client request. Unknown Type.');
                console.log(parsed_message);
                break;
        }

    });

});
