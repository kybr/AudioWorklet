class MainProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: 'gain',
        defaultValue: 0.0,
        minValue: 0.0,
        maxValue: 1.0
      }
    ]
  }

  constructor(options) {
    super(options) 
    this.port.onmessage = (event) => {
      console.log("MainProcessor:", event.data);
    }
    this.port.postMessage('Hi!');
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    const gain = parameters.gain;
    for (let channel = 0; channel < input.length; ++channel) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];

      for (let i = 0; i < inputChannel.length; ++i)
        if (gain.length === 1) {
          outputChannel[i] = inputChannel[i] * gain[0];
        } else {
          outputChannel[i] = inputChannel[i] * gain[i];
        }
    }
    return true;
  }
}
registerProcessor('main-processor', MainProcessor);
