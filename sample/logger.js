var _img = null;
var _queue = [];
var _ongoingRequest = false;
initLog = function() {
	var body = document.getElementsByTagName("body")[0];
	_img = document.createElement("IMG");
	body.appendChild(_img);
	polling();
}
log = function(className, msg, sev) {
	_queue.push(window.location.origin.replace("https", "http") + ":8666/" + "?classname=" + className + "&log=" + encodeURIComponent(msg) + "&sev=" + sev+ "&logdate=" + (new Date()).getTime());
}
processQueue = function() {
	_ongoingRequest = true;
	_img.src = _queue.shift()+ "&senddate=" + (new Date()).getTime();
}

polling = function() {
	setInterval(function() {
		if (_img.complete) {
			_ongoingRequest = false;
			if (_queue.length > 0) {
				processQueue();
			}
		}
	}, 100);
}

initLog();
log("Myfile.js","My message","DEBUG");