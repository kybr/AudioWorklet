# Audio Worklet

**Note**: This repository represents 

- We're using Chrome Version 74.0.3729.131
- You can't just open `index.html` and expect it to work
  + We get a [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) error [^error]
- It seems like you have to have a secure (HTTPS) connection to get AudioWorklet
  + Using `http` (no SSL), we find that `window.AudioContext.audioWorklet` is undefined
  + Use `https`; This uses Python3

[^error]: `Access to script at 'file:///..................................../main-processor.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, https.`

How to start:

    ./https

Then open the URL in Chrome


## Goals / TODO

The meta-goal is to learn how this stuff (i.e., web browser + JavaScript) works
and develop trust with the stack. Another meta-goal is to show others. We need
to make a few examples that show how to use Audio Worklet *in practice* and keep
track of the stuff that does not work. We need minimum working examples that:

- Show the most basic use of Audio Worklet; A sine wave
- Illustrate the use of Parameters, including the various methods such as
  `linearRampToValueAtTime()`; A mouse-controlled sine wave
- Show how to pass messages between Node and Processor
  + Try to send sample-generating closures. These need to be completely self-
    contained because the scope of Processor is separate from Node, right?
- Connect the microphone to our processor


**Open Questions**:

- Can we abuse message passing to execute per-sample processing?
  + i.e., can pass functions as messages?
  + i.e., can we use `eval` in a processor?
- Is the JavaScript environment safe for audio?
  + an engineer said that the v8 interpreter was still making decisions after
    *minutes* and that the before that, the interpreter was in the process of
    getting faster and faster; We should profile


## Reading / Watching
<!-- https://webaudio.github.io/web-audio-api/#AudioWorklet -->
<!-- https://www.linkedin.com/in/hongchanchoi/ -->

- [w3 docs on audio worklet](https://www.w3.org/TR/webaudio/#audioworklet)
- [AudioWorklet :: What, Why, and How - Hongchan Choi](https://www.youtube.com/watch?v=g1L4O1smMC0)
- [Enter Audio Worklet](https://developers.google.com/web/updates/2017/12/audio-worklet)
- [Audioworklet: the Future of Web Audio](https://quod.lib.umich.edu/i/icmc/bbp2372.2018.021/1)

