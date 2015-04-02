//{cl:cl, log:query.log, sev:sev, logdate:query.logdate, senddate:query.senddate, depth:depth}
var logString = "<div class=\"row <%= sev %>\">" + "<div class=\"col-md-3\"><%= cl %></div>" +
  "<div class=\"col-md-3\"><%= log %></div>" + "<div class=\"col-md-3\"><%= logdate %></div>" +
  "<div class=\"col-md-3\"><%= depth %></div></div>";

var odd = true;
var logs = [];
var active;

var app = function() {
  console.log("Starting the application");
  startSpinner();
  reqwest({
    url: 'rest/conf',
    type: 'json'
  }).then(function(resp) {
    handleLogs();
    if (resp.firebase) {
      var myDataRef = new Firebase(resp.firebase + "/log_list");
      myDataRef.on('child_added', function(snapshot) {
        logs.push(snapshot.val());
        //Call the current callback
        active(snapshot.val());
      });
    }
  }).fail(function(err, msg) {
    console.dir(msg);
  }).always(function(resp) {
    stopSpinner();
    console.dir("OK");
  });
};
var spinner;
var startSpinner = function() {
  var target = document.getElementById('main');
  spinner = getSpinner().spin(target);
};

var getSpinner = function() {
  if (!spinner) {
    var opts = {
      lines: 13, // The number of lines to draw
      length: 20, // The length of each line
      width: 10, // The line thickness
      radius: 30, // The radius of the inner circle
      corners: 1, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#000', // #rgb or #rrggbb or array of colors
      speed: 1, // Rounds per second
      trail: 60, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: '50%', // Top position relative to parent
      left: '50%' // Left position relative to parent
    };
    return new Spinner(opts);
  } else {
    return spinner;
  }
};

var stopSpinner = function() {
  spinner.stop();
};

var loadView = function(view) {
  document.getElementById("main").innerHTML = view;
};