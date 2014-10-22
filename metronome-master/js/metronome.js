var audioContext = null;
var isPlaying = false;      // Are we currently playing?
var isPaused = false;
var startTime;              // The start time of the entire sequence.
var current16thNote;        // What note is currently last scheduled?
var tempo = 120.0;          // tempo (in beats per minute)
var lookahead = 25.0;       // How frequently to call scheduling function (in milliseconds)
var scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec) This is calculated from lookahead, and overlaps with next interval (in case the timer is late)
var nextNoteTime = 0.0;     // when the next note is due.
var noteResolution = 0;     // 0 == 16th, 1 == 8th, 2 == quarter note
var noteLength = 0.1;      // length of "beep" (in seconds)
var canvas,                 // the canvas element
    canvasContext;          // canvasContext is the canvas' context 2D
var last16thNoteDrawn = -1; // the last "box" we drew on the screen
var notesInQueue = [];      // the notes that have been put into the web audio, and may or may not have played yet. {note, time}
var timerWorker = null;     // The Web Worker used to fire timer messages
var bufferLoader;           // Kriss - for loading individual sounds
var SOUNDS = [];           // Kriss - for passing off individual samples to the webkit looper
var eighthNoteTime = (60 / tempo) / 2;



// set up the audio file loaders

function BufferLoader(context, urlList, callback) {
  this.context = audioContext;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount === loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}



// the requestAnimationFrame API, with a setTimeout fallback

window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( callback ){
        window.setTimeout(callback, 1000 / 60);
    };
})();

function nextNote() {
    // Advance current note and time by a 16th note...
    var secondsPerBeat = 60.0 / tempo;    // Notice this picks up the CURRENT tempo value to calculate beat length.
    nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time
    current16thNote++;    // Advance the beat number, wrap to zero
    if (current16thNote === 16) {
        current16thNote = 0;
    }
}

function scheduleNote( beatNumber, time ) {
    // push the note on the queue, even if we're not playing.
    notesInQueue.push( { note: beatNumber, time: time } );

    if ( (noteResolution === 1) && (beatNumber % 2))
        return; // we're not playing non-8th 16th notes
    if ( (noteResolution === 2) && (beatNumber % 4))
        return; // we're not playing non-quarter 8th notes

    source = audioContext.createBufferSource();


    // create an oscillator
    // var osc = audioContext.createOscillator();
    // osc.connect( audioContext.destination );
    if (beatNumber % 16 === 0) {   // beat 0 == low pitch
        source.buffer = SOUNDS[0];
        // osc.frequency.value = 880.0;
    } else if (beatNumber % 4 === 0 ) {   // quarter notes = medium pitch
        source.buffer = SOUNDS[1];
        // osc.frequency.value = 440.0;
    } else {                 // other 16th notes = high pitch
        source.buffer = SOUNDS[2];
        //osc.frequency.value = 220.0;
    }
    if (beatNumber === 3) {
        source.buffer = SOUNDS[5];
    }

    // osc.start( time );
    // osc.stop( time + noteLength );
    source.connect(audioContext.destination);
    source.start(time);
}


function scheduler() {
    // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
        scheduleNote( current16thNote, nextNoteTime );
        nextNote();
    }
}


function play() {
    isPlaying = !isPlaying;
    isPaused = false;

    if (isPlaying) { // start playing
        current16thNote = 0;
        nextNoteTime = audioContext.currentTime;
        timerWorker.postMessage("start");
        return "stop";
    } else {
        timerWorker.postMessage("stop");
        return "play";
    }
    
}


function pause() {
    isPaused = !isPaused;

    if (!isPaused) { // start playing
        //current16thNote = 0;
        nextNoteTime = audioContext.currentTime;
        timerWorker.postMessage("start");
        return "pause";
    } else {
        timerWorker.postMessage("stop");
        return "resume";
    }
}


function resetCanvas (e) {
    // resize the canvas - but remember - this clears the canvas too.
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //make sure we scroll to the top left.
    window.scrollTo(0,0); 
}


function draw() {
    var currentNote = last16thNoteDrawn;
    var currentTime = audioContext.currentTime;

    console.log(currentNote);

    $('.blink').removeClass('blink');
    $('#sq-' + currentNote).addClass('blink');

    while (notesInQueue.length && notesInQueue[0].time < currentTime) {
        currentNote = notesInQueue[0].note;
        notesInQueue.splice(0,1);   // remove note from queue
    }

    // We only need to draw if the note has moved.
    if (last16thNoteDrawn !== currentNote) {
        var x = Math.floor( canvas.width / 18 );
        canvasContext.clearRect(0,0,canvas.width, canvas.height); 
        for (var i = 0; i < 16; i++) {
            canvasContext.fillStyle = ( currentNote === i ) ? 
                ((currentNote % 4 === 0)?"red":"blue") : "black";
            canvasContext.fillRect( x * (i + 1), x, x / 2, x / 2 );
        }
        last16thNoteDrawn = currentNote;
    }

    // set up to draw again
    requestAnimFrame(draw);
}


function finishedLoading(bufferList) {
    console.log('loaded');
    SOUNDS = bufferList;
}


function init() {

    console.log('initializing/loading');

    var container = document.createElement( 'div' );
    container.className = "container";
    canvas = document.createElement( 'canvas' );
    canvasContext = canvas.getContext( '2d' );
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight; 
    document.body.appendChild( container );
    container.appendChild(canvas);    
    canvasContext.strokeStyle = "#ffffff";
    canvasContext.lineWidth = 2;

    // NOTE: THIS RELIES ON THE MONKEYPATCH LIBRARY BEING LOADED FROM
    // Http://cwilso.github.io/AudioContext-MonkeyPatch/AudioContextMonkeyPatch.js
    // TO WORK ON CURRENT CHROME!!  But this means our code can be properly
    // spec-compliant, and work on Chrome, Safari and Firefox.

    audioContext = audioContext || new AudioContext();

    bufferLoader = new BufferLoader(
        audioContext,
        [
          '../sounds/Kick16.wav',
          '../sounds/Snare06.wav',
          '../sounds/Tom02.wav',
          '../sounds/OpenHat09.wav',
          '../sounds/Tom03.wav',
          '../sounds/sncf.wav',
        ],
        finishedLoading
    );

    bufferLoader.load();

    // if we wanted to load audio files, etc., this is where we should do it.

    window.onorientationchange = resetCanvas;
    window.onresize = resetCanvas;

    requestAnimFrame(draw);    // start the drawing loop.

    timerWorker = new Worker("js/metronomeworker.js");

    timerWorker.onmessage = function(e) {
        if (e.data === "tick") {
            console.log("tick!");
            scheduler();
        } else {
            console.log("message: " + e.data);
        }
    };
    timerWorker.postMessage({"interval":lookahead});
}

window.addEventListener("load", init );
