var mysql = require('mysql');
var logger = console
var checkInterval = 500
var queryTimeout = 3000

var connectionState = false;
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'pika',
  database: 'wingify_yatharth',
  insecureAuth: true
});
connection.on('close', function (err) {
  logger.error('mysqldb conn close');
  connectionState = false;
});
connection.on('error', function (err) {
  logger.error('mysqldb error: ' + err);
  connectionState = false;
});

function attemptConnection(connection) {
  if(!connectionState){
    connection = mysql.createConnection(connection.config);
    connection.connect(function (err) {
      // connected! (unless `err` is set)
      if (err) {
        logger.error('mysql db unable to connect: ' + err);
        connectionState = false;
      } else {
        logger.info('mysql connect!');

        connectionState = true;
      }
    });
    connection.on('close', function (err) {
      logger.error('mysqldb conn close');
      connectionState = false;
    });
    connection.on('error', function (err) {
      logger.error('mysqldb error: ' + err);

      if (!err.fatal) {
        //throw err;
      }
      if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
        //throw err;
      } else {
        connectionState = false;
      }

    });
  }
}
attemptConnection(connection);

var dbConnChecker = setInterval(function(){
  if(!connectionState){
    logger.info('not connected, attempting reconnect');
    attemptConnection(connection);
  }
}, checkInterval);

// Mysql query wrapper. Gives us timeout and db conn refreshal! 
var queryTimeout = queryTimeout;
var query = function(sql,params,callback){
  if(connectionState) {
    // 1. Set timeout
    var timedOut = false;
    var timeout = setTimeout(function () {
      timedOut = true;
      callback('MySQL timeout', null);
    }, queryTimeout);

    // 2. Make query
    connection.query(sql, params, function (err, rows) {
      clearTimeout(timeout);
      if(!timedOut) callback(err,rows);
    });
  } else {
    // 3. Fail if no mysql conn (obviously)
    callback('MySQL not connected', null);
  }
}

// And we present the same interface as the node-mysql library!
// NOTE: The escape may be a trickier for other libraries to emulate because it looks synchronous
exports.query = query;
exports.escape = connection.escape;