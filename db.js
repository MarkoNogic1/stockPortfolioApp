var mysql = require('mysql');
var config = require('./config');

var connection = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    port: config.database.port,
    database: config.database.database
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;