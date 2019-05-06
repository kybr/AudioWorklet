'use strict'

var context;

async function startAudio() {
  console.log('Audio: starting...');


  //
  // This example is adapted from 'The BitCrusher Node' found here:
  //
  //   https://www.w3.org/TR/webaudio/#the-bitcrusher-node
  //
  // We notice that we have to change some code to make it run.
  //

  context = new AudioContext();
  await context.audioWorklet.addModule('bitcrusher.js');

  let osc = new OscillatorNode(context);
  let amp = new GainNode(context);
  // Create a worklet node. 'BitCrusher' identifies the
  // AudioWorkletProcessor previously registered when
  // bitcrusher.js was imported. The options automatically
  // initialize the correspondingly named AudioParams.
  let bitcrusher = new AudioWorkletNode(context, 'BitCrusher', {
    bitDepth: 2,
    frequencyReduction: 0.5
  });
  osc
//    .connect(bitcrusher)
    .connect(amp)
    .connect(context.destination);
  osc.start();
}

function stopAudio() {
  console.log('Audio: stopping...');

  if (context) {
    context.suspend();
    context.close();
    context = null;
  }
}

var b = document.querySelector('#audio');
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
});
