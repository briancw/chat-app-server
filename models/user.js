/*jslint node: true */

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var user_schema = mongoose.Schema({

    local: {
        email    : String,
        password : String
    }

});

// generating a hash
user_schema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
user_schema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', user_schema);
