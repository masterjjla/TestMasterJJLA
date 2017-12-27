'use strict';
//  var main            = require('./main.js');
var colors          = require('colors');
var mysql           = require('mysql');
var q               = require('q');
var MySQLConnection = {};

MySQLConnection.connect = function(){
    var d = q.defer();
    MySQLConnection.connection = mysql.createConnection({
        host                : '192.168.1.101',
        user                : '...',
        password            : '...',
        database            : '...'
    });

    MySQLConnection.connection.connect(function (err) {
        if(err) {
            console.log('Not connected '.red, err.toString().red, ' RETRYING...'.blue);
            d.reject();
        } else {
            console.log('Connected to Mysql. Exporting..'.blue);
            d.resolve(MySQLConnection.connection);
        }
    });
    return d.promise;
};

module.exports = MySQLConnection;
