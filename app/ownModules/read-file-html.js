var fs = require('fs');

module.exports.readHTMLFile = function(path, callback) {   
    fs.readFile(path, {encoding: 'utf-8'}, function (err, fileHTML) {
        if (err) {
            callback(err);
        }
        else {
            callback(null, fileHTML);
        }
    });
};