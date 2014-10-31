var http = require("http");
var url = require('url');
var fs = require('fs');
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
    if (filter==undefined || (cl.indexOf(filter) > -1 || query.log.indexOf(filter) > -1 || sev.indexOf(filter) > -1)) {
      var log = getMessage(cl, query.log, sev);
      if (logfile) {
        fs.appendFileSync(logfile, log + "\n");
      }
      console.log(log);
    }
  } else {
    console.log("Missing parameter:" + request.url);
  }
  var img = fs.readFileSync('./logo.gif');
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
  debug: 'blue'
}

function getColor(sev) {
  return sevColor[sev] ? sevColor[sev] : 'blue';
}

function getMessage(classname, msg, sev) {
  var s = [];
  s.push("[" + getFormatedDate(new Date()) + "]");
  s.push("[" + classname + "]");
  s.push("[" + sev.toUpperCase() + "]");
  s.push(msg);
  return (s.join(""))[getColor(sev)];
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