var handleLogs = function() {
  console.log("Starting handeling logs");
  navtologs();
  reqwest({
    url: 'rest/data',
    type: 'json'
  }).then(function(resp) {
    logs = resp.logs;
    displaylogs();
  });
};

var displaylogs = function() {
  console.time("displaylogs");
  var content = "";
  for (var i = 0; i < logs.length; i++) {
    content = addNewLog(logs[i]);
  }
  injectLog(content);
  console.timeEnd("displaylogs");
};

var addNewLog = function(log, inject) {
  inject = inject == undefined ? true : inject;
  var logTemplate = _.template(logString);
  log['style'] = odd ? "odd" : "even";
  var content = logTemplate(log);
  if (inject) {
    injectLog(content);
  }
  odd = !odd;
  return content;
};
var injectLog = function(content) {
  document.getElementById("main").innerHTML += content;
};


var navtologs = function() {
  console.log("Nav to logs");
  var logTemplate = _.template(logString);
  loadView(logTemplate({
    style: "header",
    cl: "ClassName",
    log: "Log Message",
    logdate: "Date",
    depth: "Depth",
    sev: "header"
  }));
  displaylogs();
  //set the active page callback
  active = updatelog;
};

var updatelog = function(log) {
  addNewLog(log);
};