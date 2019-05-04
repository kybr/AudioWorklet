'use strict'

// https://webaudio.github.io/web-audio-api/#AudioWorklet-Sequence -- they seem to force you to load a .js file. i want to constantly edit that file!
// https://github.com/charlieroberts/genish.js/blob/master/playground/environment.js
//

var context = null
var oscillator = null
var main_processor = null

class MyWorkletNode extends AudioWorkletNode {
  constructor(context, options) {
    super(context, 'main-processor');
    this.port.onmessage = (event) => {
      console.log("MyWorkletNode:", event.data);
    }
    this.port.postMessage('Hi!');
  }
}

async function startAudio() {
  console.log('Audio: starting...')
  window.AudioContext = window.AudioContext || window.webkitAudioContext
  context = new AudioContext()
  console.log(context)

  await context.audioWorklet.addModule('./main-processor.js')

  // wiring the audio graph
  oscillator = new OscillatorNode(context);
  main_processor = new MyWorkletNode(context, 'main-processor');
  oscillator.connect(main_processor).connect(context.destination);

  oscillator.start();
}

function stopAudio() {
  console.log('Audio: stopping...')
  if (context) {
    context.suspend()
    context.close()
    context = null
  }
}

var mouse_monitor = function(e) {
  var x = e.pageX / window.innerWidth
  var y = e.pageY / window.innerHeight
  if (main_processor && context) {
    // https://developer.mozilla.org/en-US/docs/Web/API/AudioParam
    main_processor.parameters.get('gain').linearRampToValueAtTime(x, context.currentTime + 0.2)
  }
//  console.log(x, y)
}

window.addEventListener("unhandledrejection", function(promiseRejectionEvent) { 
  // handle error here, for example log   
  console.log(promiseRejectionEvent)
})

window.onload = function() {
  let b = document.querySelector('#audio')
  b.addEventListener("click", function(event) {
    if (b.innerHTML == 'On') {
      b.innerHTML = 'Off'
      startAudio()
    }
    else if (b.innerHTML == 'Off') {
      b.innerHTML = 'On'
      stopAudio()
    }
    else {
      alert('this should NEVER happen')
    }
  })

  window.addEventListener('mousemove', mouse_monitor)
}
