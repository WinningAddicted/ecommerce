var mysql = require('mysql');
var databaseConfigs = require('./configs').databaseConfigs;

var checkInterval = databaseConfigs.checkInterval;
var queryTimeout = databaseConfigs.queryTimeout;
var connectionState = false;

var connection = mysql.createConnection(databaseConfigs);

connection.on('close', function(err) {
    console.log('mysqldb conn close');
    connectionState = false;
});

connection.on('error', function(err) {
    console.log('mysqldb error: ' + err);
    connectionState = false;
});

function attemptConnection(connection) {
    /**
     * Attempts MySQL Connection
     */

    if (!connectionState) {
        connection = mysql.createConnection(databaseConfigs);
        connection.connect(function(err) {
            // connected! (unless `err` is set)
            if (err) {
                console.log('mysql db unable to connect: ' + err);
                connectionState = false;
            }
            else {
                console.log('mysql connect!');
                connectionState = true;
            }
        });
        connection.on('close', function(err) {
            console.log('mysqldb conn close');
            connectionState = false;
        });
        connection.on('error', function(err) {
            console.log('mysqldb error: ' + err);
            connectionState = false;
        });
    }
}
attemptConnection(connection);

var dbConnChecker = setInterval(function() {
     /**
     * Checks MySQL Connection, if Not connected attempts reconnect at regular intervals
     */

    if (!connectionState) {
        console.log('not connected, attempting reconnect');
        attemptConnection(connection);
    }
}, checkInterval);

var queryTimeout = queryTimeout;
var query = function(sql, params, callback) {
    /**
     * Mysql query wrapper. Gives us timeout and db conn refreshal
     */

    if (connectionState) {
        // 1. Set timeout
        var timedOut = false;
        var timeout = setTimeout(function() {
            timedOut = true;
            callback('MySQL timeout', null);
        }, queryTimeout);

        // 2. Make query
        connection.query(sql, params, function(err, rows) {
            clearTimeout(timeout);
            if (!timedOut) callback(err, rows);
        });
    }
    else {
        // 3. Fail if no mysql conn
        callback('MySQL not connected', null);
    }
}

exports.query = query;