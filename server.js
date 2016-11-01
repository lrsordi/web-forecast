#!/usr/bin/env node

/**
 * Module dependencies.
 */

/**
 * Get port from environment and store in Express.
 */
var express = require('express');
var app = express();
var debug = require('debug');
var http = require('http');
var port = normalizePort(process.env.PORT || '3000');
var server = http.createServer(app);


app.use('/public', express.static(__dirname + '/app/public'));



app.get('*', function(req, res, next) {
  res.sendFile(__dirname + "/app/index.html");
  //res.status(404).send('Sorry cant find that!');
});




// prerender

  //.set('prerenderServiceUrl', (process.env.NODE_ENV !== 'production') ? 'http://localhost:1137/' : 'http://service.prerender.io/')




app.set('port', port);

/**
 * Create HTTP server.
 */


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
