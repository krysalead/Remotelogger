#!/usr/bin/env node

/**
 * Log server allow to store the log from a remote application into this server as a file of on the output
 */
var http = require("http");
var url = require('url');
var fs = require('fs');
var path = require('path');
//npm install colors
var colors = require('colors');
//npm install yargs
var argv = require('yargs').argv;

var logfile = argv.logfile;
var filter = argv.filter;

var server = http.createServer(function(request, response) {
  var url_parts = url.parse(request.url, true);
  var query = url_parts.query;
  if (query.log) {
    var sev = query.sev ? query.sev : 'log';
    var cl = query.classname ? query.classname : "General";
    var depth = query.depth;
    if (filter == undefined || (cl.indexOf(filter) > -1 || query.log.indexOf(filter) > -1 || sev.indexOf(filter) >
        -1)) {
      var log = getMessage(cl, query.log, sev, query.logdate, query.senddate, depth);
      if (logfile) {
        fs.appendFile(logfile, log + "\n", function(err) {
          if (err) {
            console.error('Fail to write in ' + logfile);
            console.error(err);
          }
        });
      }
      console.log(log);
    }
  } else {
    console.log("Missing parameter:" + request.url);
  }
  var img = fs.readFileSync(path.join(__dirname, 'logo.gif'));
  response.writeHead(200, {
    'Content-Type': 'image/gif'
  });
  response.end(img, 'binary');
  response.end();
});

var sevColor = {
  log: 'green',
  error: 'red',
  warn: 'yellow',
  debug: 'white',
  info: 'cyan'
};

function getColor(sev) {
  return sevColor[sev.toLowerCase()] ? sevColor[sev.toLowerCase()] : 'white';
}

function getMessage(classname, msg, sev, logtime, senttime, depth) {
  var s = [];
  s.push(getSpace(depth));
  s.push("[" + getFormatedDate(new Date(1 * logtime)) + "]");
  s.push("[" + formatTime((new Date()).getTime() - senttime) + "]");
  s.push("[" + classname + "]");
  s.push("[" + sev.toUpperCase() + "]");
  s.push(msg);
  return (s.join(""))[getColor(sev)];
}

function getSpace(depth) {
  depth = depth ? depth : 0;
  var s = "" + depth;
  for (var i = 0; i < depth; i++) {
    s += "_";
  }
}

function formatTime(duration) {
  var milliseconds = parseInt(duration % 1000, 10),
    seconds = parseInt((duration / 1000) % 60, 10),
    minutes = parseInt((duration / (1000 * 60)) % 60, 10);

  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return minutes + ":" + seconds + "." + milliseconds;
}

function getFormatedDate(date) {
  var s = [];
  s.push(date.getFullYear());
  s.push(date.getMonth());
  s.push(date.getDate());
  s.push(date.getHours());
  s.push(date.getMinutes());
  s.push(date.getSeconds());
  return s.join("-");
}

var port = 8666;
server.listen(port);
console.log("Server is listening:" + port);
var s = [];
s.push("[LOG DATE]");
s.push("[DURATION CLIENT SERVER]");
s.push("[JAVASCRIPT CLASS]");
s.push("[SEVERITY]");
s.push("MESSAGE");
console.log(s.join(''));