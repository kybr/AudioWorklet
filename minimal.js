'use strict'

var context = null;
var oscillator = null;
var main_processor = null;

class MyWorkletNode extends AudioWorkletNode {
  constructor(context, options) {
    super(context, 'main-processor');

    this.port.onmessage = (event) => {
      console.log("MyWorkletNode");
      console.log(event);
    }

    this.port.postMessage('MyWorkletNode -> MainProcessor');
  }
}

async function startAudio() {
  console.log('Audio: starting...');
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();
  // console.log(context);

  await context.audioWorklet.addModule('./main-processor.js');

  // wiring the audio graph
  oscillator = new OscillatorNode(context);
  main_processor = new MyWorkletNode(context, 'main-processor');
  oscillator.connect(main_processor).connect(context.destination);

  oscillator.start();
}

function stopAudio() {
  console.log('Audio: stopping...');
  if (context) {
    context.suspend();
    context.close();
    context = null;
  }
}

var mouse_monitor = function(e) {
  var x = e.pageX / window.innerWidth;
  var y = e.pageY / window.innerHeight;
  if (main_processor && context) {
    // https://developer.mozilla.org/en-US/docs/Web/API/AudioParam
    main_processor.parameters.get('gain')
      .linearRampToValueAtTime(x, context.currentTime + 0.02);
  }
//  console.log(x, y)
}

window.addEventListener("unhandledrejection", function(e) { 
  // handle error here, for example log   
  console.log(e);
})

window.onload = function() {

  // find the audio button and attach
  let b = document.querySelector('#audio');
  b.addEventListener("click", function(event) {
    if (b.innerHTML == 'On') {
      b.innerHTML = 'Off';
      startAudio();
    }
    else if (b.innerHTML == 'Off') {
      b.innerHTML = 'On';
      stopAudio();
    }
    else {
      alert('this should NEVER happen');
    }
  })

  window.addEventListener('mousemove', mouse_monitor);

  let d = document.querySelector('#full');
  d.addEventListener('click', (event) => {
      console.log([event.pageX / window.innerWidth, event.pageY / window.innerHeight]);
    if (main_processor) {
      main_processor.port.postMessage([event.pageX / window.innerWidth, event.pageY / window.innerHeight]);
      //main_processor.port.postMessage({message: [event.pageX, event.pageY]});
    }
    console.log('clicked');
  }, false /* don't capture this event */);
}
