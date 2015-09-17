/*jslint node: true */

module.exports = {

    index: function(req, res) {
        res.send(
            'Woah man. No gets around here.'
        );
    }

};

function secret_private_function() {
    return 'secretz';
}
