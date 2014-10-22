function BufferLoader(context, urlList, callback) {
  this.context = context;
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
        if (++loader.loadCount == loader.urlList.length)
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


window.onload = init;
var context;
var bufferLoader;
var BUFFERS = [];

function init() {

  console.log('loading');

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
      '../sounds/Kick16.wav',
      '../sounds/Snare06.wav',
      '../sounds/OpenHat09.wav',
      '../sounds/Tom02.wav',
      '../sounds/Tom03.wav',
    ],
    finishedLoading
    );

  bufferLoader.load();
}

function finishedLoading(bufferList) {

  console.log('loaded');

  BUFFERS = bufferList;
}


var SampleLoop = {};
SampleLoop.gainNode = null;


SampleLoop.play = function() {

  // introduce gain control
  if (!context.createGain)
    context.createGain = context.createGainNode;
  this.gainNode = context.createGain();


  function playSounds(buffer, time) {
    source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(time);
  }

  function playLoop() {
    for (var bar = 0; bar < 1; bar++) {
      var time = startTime + bar * 8 * eighthNoteTime;
      
      // Play the bass (kick) drum on beats 1, 5
      playSounds(kick, time);
      playSounds(kick, time + 4 * eighthNoteTime);

      // Play the snare drum on beats 3, 7
      playSounds(snare, time + 2 * eighthNoteTime);
      playSounds(snare, time + 6 * eighthNoteTime);

      // add toms
      playSounds(tom_1, time + 5 * eighthNoteTime);
      playSounds(tom_1, time + 7 * eighthNoteTime);
      playSounds(tom_2, time + 6 * eighthNoteTime);

      // Play the hi-hat every eighth note.
      for (var i = 0; i < 8; ++i) {
        playSounds(hihat, time + i * eighthNoteTime);
      }
    }
  }

  // load the sounds we want
  var kick = BUFFERS[0];
  var snare = BUFFERS[1];
  var hihat = BUFFERS[2];
  var tom_1 = BUFFERS[3];
  var tom_2 = BUFFERS[4];

  // timing variables
  var startTime = context.currentTime;
  var tempo = 120; // BPM (beats per minute)
  var eighthNoteTime = (60 / tempo) / 2;
};

SampleLoop.stop = function() {
  if (!this.source.stop)
    this.source.stop = source.noteOff;
  this.source.stop(0);
};

SampleLoop.toggle = function() {
  this.playing ? this.stop() : this.play();
  this.playing = !this.playing;
};





VolumeSample.play = function() {
  if (!context.createGain)
    context.createGain = context.createGainNode;
  this.gainNode = context.createGain();

  var source = context.createBufferSource();
  source.buffer = BUFFERS.techno;

  // Connect source to a gain node
  source.connect(this.gainNode);
  // Connect gain node to destination
  this.gainNode.connect(context.destination);
  // Start playback in a loop
  source.loop = true;
  if (!source.start)
    source.start = source.noteOn;
  source.start(0);
  this.source = source;
};

VolumeSample.changeVolume = function(element) {
  var volume = element.value;
  var fraction = parseInt(element.value) / parseInt(element.max);
  // Let's use an x*x curve (x-squared) since simple linear (x) does not
  // sound as good.
  this.gainNode.gain.value = fraction * fraction;
};

VolumeSample.stop = function() {
  if (!this.source.stop)
    this.source.stop = source.noteOff;
  this.source.stop(0);
};

VolumeSample.toggle = function() {
  this.playing ? this.stop() : this.play();
  this.playing = !this.playing;
};




