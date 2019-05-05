# Audio Worklet

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


## Reading / Watching
<!-- https://webaudio.github.io/web-audio-api/#AudioWorklet -->
<!-- https://www.linkedin.com/in/hongchanchoi/ -->

- [w3 docs on audio worklet](https://www.w3.org/TR/webaudio/#audioworklet)
- [AudioWorklet :: What, Why, and How - Hongchan Choi](https://www.youtube.com/watch?v=g1L4O1smMC0)
- [Enter Audio Worklet](https://developers.google.com/web/updates/2017/12/audio-worklet)
- [Audioworklet: the Future of Web Audio](https://quod.lib.umich.edu/i/icmc/bbp2372.2018.021/1)

