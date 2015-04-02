var parsed;
var navtoDiagram = function() {
  loadView("<div id=\"diagram\"></div>");
  updateDiagram(null);
  //set the active page callback
  active = updateDiagram;
};

var updateDiagram = function(log) {
  startSpinner();
  console.time("updateDiagram");
  parsed = parseLogs("user");
  var diagram = Diagram.parse(parsed);
  diagram.drawSVG("diagram", {
    theme: 'simple'
  });
  console.timeEnd("updateDiagram");
  stopSpinner();
};

var _actorsSeen = [];
var _current = null;
var parseLogs = function(current) {
  _current = current;
  _actorsSeen.push(current);
  var root = "";
  for (var i in logs) {
    var log = logs[i];
    root += handleSingleLog(log);
  }
  return root;
};

var handleSingleLog = function(log) {
  var separator = "\n";
  var root = "";
  if (log.log.indexOf("Entering") > -1) {
    //We are entering a function
    if (_current != log.cl) {
      if (_actorsSeen.join("#").indexOf(log.cl) > -1) {
        //Maybe someone we have seen already
        root += _current + "-->>" + log.cl + ":" + log.log + separator;
      } else {
        //On a different object
        root += _current + "->" + log.cl + ": " + log.log + separator;
        _actorsSeen.push(log.cl);
        _current = log.cl;
      }
    } else {
      root += "note right of " + log.cl + ": " + log.log + separator;
    }
    _current = log.cl;
  }
  return root;
};