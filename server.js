var http = require('http');
var fs = require('fs');
var mysql = require('mysql');
var express = require('express');
var app = express();
var listConnectedUser = [];

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "irc"
});

con.connect(function(err) {
  if (err) throw err;
});

var sql = "Select ID from Channel";
con.query(sql, function(err, channels) {
  if (err) throw err;
  for (var i = 0; i < channels.length; i++) {
    listConnectedUser[channels[i].ID] = [];
  }
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
  } else if (req.url === '/index-script.js') {
    fs.readFile('index-script.js', function(err, data) {
      res.write(data);
      res.end();
    });
  } else if (req.url === '/main-script.js') {
    fs.readFile('main-script.js', function(err, data) {
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
  } else {
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
  socket.on('tryConnect', function(message) {
    var sql = 'Select count(*) as count from User where Name ="' + message[0] + '" and Password = "' + message[1] + '"';
    con.query(sql, function(err, count) {
      if (err) throw err;
      if (count[0].count > 0) {
        socket.emit("ConnectSuccess");
      } else {
        socket.emit("ConnectFailure");
      }
    });
  });
  socket.on('signin', function(params) {
    var sql = "Select count(*) as count from User where Name='" + params[0] + "'";
    con.query(sql, function(err, name) {
      if (err) throw err;
      if (name[0].count > 0) {
        socket.emit("NameInUse");
      } else {
        var sql = "Insert into User (Name, Password) values ('" + params[0] + "','" + params[1] + "')";
        con.query(sql, function(err, mail) {
          if (err) throw err;
          socket.emit("AccountCreated");
        });
      }
    });
  });
  socket.on('newMessage', function(params) {
    io.sockets.emit('newMessage', params);
  });
  socket.on('newChannel', function(params) {
    var sql = "Select count(*) as count from Channel where Name='" + params[0] + "'";
    con.query(sql, function(err, name) {
      if (err) throw err;
      if (name[0].count > 0) {
        socket.emit("ChannelExists");
      } else {
        var sql = "Insert into Channel (Name) values ('" + params[0] + "')";
        con.query(sql, function(err, value) {
          if (err) throw err;
          var sql = 'Select ID from Channel where Name = "' + params[0] + '"';
          con.query(sql, function(err, ChannelID) {
            if (err) throw err;
            var sql = 'Select ID from Role where Name = "Owner"';
            con.query(sql, function(err, roleID) {
              if (err) throw err;
              var sql = 'Select ID from User where Name = "' + params[1] + '"';
              con.query(sql, function(err, userID) {
                if (err) throw err;
                var sql = "Insert into Connection (User, Role, Channel) values ('" + userID[0].ID + "','" + roleID[0].ID + "','" + ChannelID[0].ID + "')";
                con.query(sql, function(err, userID) {
                  if (err) throw err;
                  listConnectedUser[ChannelID.ID] = [];
                  socket.emit("ChannelCreated");
                });
              });
            });
          });
        });
      }
    });
  });
  socket.on('deleteChannel', function(params) {
    var sql = "Select ID from Channel where Name='" + params[0] + "'";
    con.query(sql, function(err, idChannel) {
      if (err) throw err;
      var sql = "Delete from Message where ChannelId='" + idChannel[0].ID + "'";
      con.query(sql, function(err) {
        if (err) throw err;
        var sql = "Delete from Connection where Channel='" + idChannel[0].ID + "'";
        con.query(sql, function(err) {
          if (err) throw err;
          var sql = "Delete from Channel where ID='" + idChannel[0].ID + "'";
          con.query(sql, function(err) {
            if (err) throw err;
          });
        });
      });
    });
  });
  socket.on('getChannels', function() {
    var sql = "Select Name from Channel";
    con.query(sql, function(err, channels) {
      if (err) throw err;
      socket.emit("ChannelNames", channels);
    });
  });
  socket.on('ConnectedOnChannel', function(params) {
    var sql = "Select ID from Channel where Name='" + params + "'";
    con.query(sql, function(err, idChannel) {
      if (err) throw err;
      socket.emit("ConnectedOnChannel", listConnectedUser[idChannel[0].ID]);
    });
  });
  socket.on('newConnection', function(params) {
    var sql = "Select ID from Channel where Name='" + params[0] + "'";
    con.query(sql, function(err, idChannel) {
      if (err) throw err;
      var index = listConnectedUser[idChannel[0].ID].indexOf(params[1]);
      if (index == -1) {
        listConnectedUser[idChannel[0].ID].push(params[1]);
        io.sockets.emit("newConnection", params);
      }
    });
  });
  socket.on('deconnexionChannel', function(params) {
    var sql = "Select ID from Channel where Name='" + params[0] + "'";
    con.query(sql, function(err, idChannel) {
      if (err) throw err;
      var index = listConnectedUser[idChannel[0].ID].indexOf(params[1]);
      if (index != -1) {
        listConnectedUser[idChannel[0].ID].splice(index, 1);
        io.sockets.emit("deconnexionChannel", params);
      }
    });
  });
});

module.exports = app;
