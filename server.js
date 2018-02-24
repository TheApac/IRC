var http = require('http');
var fs = require('fs');
var mysql = require('mysql');
var express = require('express');
var app = express();

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "irc"
});

con.connect(function(err) {
  if (err) throw err;
});


var server = http.createServer(function(req, res) {
  if (req.url === '/style.css') {
    fs.readFile('style.css', function(err, data) {
      res.writeHead(200, {
        'Content-Type': 'text/css'
      });
      res.write(data);
      res.end();
    });
  } else if (req.url === '/script.js') {
    fs.readFile('script.js', function(err, data) {
      res.write(data);
      res.end();
    });
  } else if (req.url === '/main.html') {
    fs.readFile('main.html', function(err, data) {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write(data);
      res.end();
    });
  } else if (req.url === '/images/connectBackground.png') {
    fs.readFile('images/connectBackground.png', function(err, data) {
      res.writeHead(200, {
        'Content-Type': 'image/png'
      });
      res.write(data);
      res.end();
    });
  } else if (req.url === '/index.html'){
    fs.readFile('index.html', function(err, data) {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write(data);
      res.end();
    });
  }
}).listen(8080);

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {

});

module.exports = app;
