#!/usr/bin/env node

/**
 * The remote logger allow to log from a distant device onto your server. It is usefull when running application on
 * mobile device or also when someone is able to reproduce a bug you can't locally. We can also use this script in
 * production but log only errors so we are aware of issues happening in production
 */
var http = require("http");
var url = require('url');
var fs = require('fs');
var path = require('path');
var req = require('request');
//npm install yargs
var argv = require('yargs').argv;

/**
 * Command line parameters
 *
 * @type
 */
var logfile = argv.logfile;
var filter = argv.filter;
var firebase = argv.firebase;
var logs = [];

/**
 * Create the handle request
 */
var server = http.createServer(function(request, response) {
  if (request.url.indexOf("rest") > -1) {
    //Serve dynamic content
    handleRestContent(request, response);
    return;
  }
  if (request.url.indexOf("www") > -1) {
    //Serve the static code
    handleStaticContent(request, response);
    return;
  }
  if (request.url.indexOf("log") > -1) {
    //Serve the log request
    handleLogRequest(request, response);
    return;
  }

});

var handleRestContent = function(request, response) {
  if (request.url.indexOf("data") > -1) {
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.write(JSON.stringify({
      logs: logs
    }));
    response.end();
  }
  if (request.url.indexOf("conf") > -1) {
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.write(JSON.stringify({
      firebase: firebase
    }));
    response.end();
  }
};

var handleLogRequest = function(request, response) {
  var url_parts = url.parse(request.url, true);
  var query = url_parts.query;

  // Check that the request is a log
  if (query.log) {
    //Default parameters
    var log = {
      cl: query.classname ? query.classname : "General",
      log: query.log,
      sev: query.sev ? query.sev : 'log',
      logdate: query.logdate,
      senddate: query.senddate,
      depth: query.depth
    };
    var output = getMessage(log);
    if (filter == undefined || (log.cl.indexOf(filter) > -1 || log.log.indexOf(filter) > -1 || log.sev.indexOf(filter) >
        -1)) {
      console.log(output);
    }
    //Log file is not filtered as it can be done with an external tool
    if (logfile) {
      fs.appendFile(logfile, output + "\n", function(err) {
        if (err) {
          console.error('Fail to write in ' + logfile);
          console.error(err);
        }
      });
    }
    if (firebase) {
      //Send to firebase
      req({
        url: firebase + "/log_list.json",
        method: 'POST',
        json: log
      }, function(error, request, body) {
        if (error) {
          console.error(error);
        }
      });
    }
    logs.push(log);
  } else {
    console.log("Missing parameter:" + request.url);
  }
  // The only answer of the server to the client is the image
  var img = fs.readFileSync(path.join(__dirname, 'logo.gif'));
  response.writeHead(200, {
    'Content-Type': 'image/gif'
  });
  response.end(img, 'binary');
};

var handleStaticContent = function(request, response) {
  var uri = url.parse(request.url).pathname,
    filename = path.join(process.cwd(), uri);
  fs.exists(filename, function(exists) {
    if (!exists) {
      response.writeHead(404, {
        "Content-Type": "text/plain"
      });
      response.write("404 Not Found\n");
      response.end();
    } else {
      if (fs.statSync(filename).isDirectory()) {
        filename += '/index.html';
      }
      fs.readFile(filename, "binary", function(err, file) {
        if (err) {
          console.log(err);
          response.writeHead(500, {
            "Content-Type": "text/html"
          });
          response.write(err + "\n");
        } else {
          response.writeHead(200, {
            "Content-Type": "text/html"
          });
          response.write(file, "binary");
        }
        response.end();
      });
    }
  });

};

var sevColor = {
  log: 'green',
  error: 'red',
  warn: 'yellow',
  debug: 'white',
  info: 'cyan'
};

/**
 * Function to color the log accordingly to the severity
 */
function getColor(sev) {
  return sevColor[sev.toLowerCase()] ? sevColor[sev.toLowerCase()] : 'white';
}

/**
 * Structure the message to print
 *
 * @param {Object}
 *          log {String} cl {String} msg {String} sev {Numeric} logdate {Numeric} sentdate depth
 * @return {String} to be displayed
 */
function getMessage(log) {
    var s = [];
    s.push(getSpace(log.depth));
    s.push("[" + getFormatedDate(new Date(1 * log.logdate)) + "]");
    s.push("[" + formatTime((new Date()).getTime() - log.sentdate) + "]");
    s.push("[" + log.cl + "]");
    s.push("[" + log.sev.toUpperCase() + "]");
    s.push(log.log);
    return (s.join(""))[getColor(log.sev)];
  }
  /**
   * Return the string build with space dependending on the log
   *
   * @param {String}
   *          depth
   */
function getSpace(depth) {
  depth = depth ? depth : 0;
  var s = "";
  for (var i = 0; i < depth; i++) {
    s += "_";
  }
  return s;
}

/**
 * Small Time formater
 *
 * @param {Numeric}
 *          duration
 * @return {String}
 */
function formatTime(duration) {
  var milliseconds = parseInt(duration % 1000, 10),
    seconds = parseInt((duration / 1000) % 60, 10),
    minutes = parseInt(
      (duration / (1000 * 60)) % 60, 10
    );

  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return minutes + ":" + seconds + "." + milliseconds;
}

/**
 * Small Date formater
 *
 * @param {Numeric}
 *          date
 * @return {String}
 */
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
  /**
   * Configuration of the server port, for now it is inside the script, could be better in a configuration file
   *
   * @type Number
   */
var port = 8666;
server.listen(port);
console.log("Server is listening:" + port);
if (firebase) {
  console.log("FireBase server :" + firebase);
}
/**
 * Log structure
 *
 * @type
 */
var s = [];
s.push("[LOG DATE]");
s.push("[DURATION CLIENT SERVER]");
s.push("[JAVASCRIPT CLASS]");
s.push("[SEVERITY]");
s.push("MESSAGE");
console.log(s.join(''));