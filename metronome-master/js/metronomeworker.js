// massif thanks to Chris Wilson / HTML5ROCKS / https://github.com/cwilso/metronome/ / http://www.html5rocks.com/en/tutorials/audio/scheduling/

var timerID = null;
var interval = 100;

self.onmessage = function(e) {
	if (e.data === "start") {
		console.log("starting");
		timerID = setInterval(function() {
			postMessage("tick");
		},interval)
	}
	else if (e.data.interval) {
		console.log("setting interval");
		interval = e.data.interval;
		console.log("interval = "+interval);
		if (timerID) {
			clearInterval(timerID);
			timerID = setInterval(function() {
				postMessage("tick");
			},interval)
		}
	}
	else if (e.data === "stop") {
		console.log("stopping");
		clearInterval(timerID);
		timerID = null;
	}
};

postMessage('hi there');
