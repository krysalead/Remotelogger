var handleChart = function() {
  console.log("Starting handeling chart");
  console.time("handleChart");
  updatechart();
  //set the active page callback
  active = updatechart;
  console.timeEnd("handleChart");
};
var parsed = {};
var updatechart = function(log) {
  // Get the context of the canvas element we want to select
  var ctx = document.getElementById("chart").getContext("2d");
  if (log == undefined) {
    parsed = getData();
  } else {
    updateDataForSingleLog(log);
    parsed = formatData();
  }
  var data = {
    labels: parsed.labels,
    datasets: [{
      label: "Dataset",
      fillColor: "rgba(151,187,205,0.5)",
      strokeColor: "rgba(151,187,205,0.8)",
      highlightFill: "rgba(151,187,205,0.75)",
      highlightStroke: "rgba(151,187,205,1)",
      data: parsed.data
    }]
  };
  new Chart(ctx).Bar(data);
};
var hash = [];
var getData = function() {
  for (var i in logs) {
    var log = logs[i];
    updateDataForSingleLog(log);
  }
  return formatData();
};

var formatData = function() {
  var labels = [];
  var data = [];
  for (var i in hash) {
    labels.push(i);
    data.push(hash[i]);
  }
  return {
    data: data,
    labels: labels
  };
};

function updateDataForSingleLog(log) {
  //Filter on entering data to avoid all other logs in the same function which means not a complexity
  if (log.log.indexOf("Entering") > -1) {
    if (hash[log.cl] == undefined) {
      hash[log.cl] = 1;
    } else {
      hash[log.cl] = hash[log.cl] + 1;
    }
  }
}

var navtostat = function() {
  loadView("<canvas id=\"chart\" width=\"800\" height=\"800\"></canvas>");
  handleChart();
};