registerProcessor('BitCrusher', class extends AudioWorkletProcessor {
  static get parameterDescriptors () {
    return [{
      name: 'bitDepth',
      defaultValue: 12,
      minValue: 1,
      maxValue: 16
    }, {
      name: 'frequencyReduction',
      defaultValue: 0.5,
      minValue: 0,
      maxValue: 1
    }];
  }

  constructor (options) {
    // We don’t need to look at options: only AudioParams are initialized,
    // which were taken care of by the node.
    super(options);
    this._phase = 0;
    this._lastSampleValue = 0;
  }

  process (inputs, outputs, parameters) {
    let input = inputs[0];
    let output = outputs[0];
    let bitDepthLength = parameters.bitDepth.length;
    let reductionLength = parameters.frequencyReduction.length;

    if (bitDepthLength > 1) {
      // General case
      for (let channel = 0; channel < output.length; ++channel) {
        for (let i = 0; i < output[channel].length; ++i) {
          let step = Math.pow(0.5, parameters.bitDepth[i]);
          // Use modulo for indexing to handle the case where
          // the length of the frequencyReduction array is 1.
          this._phase += parameters.frequencyReduction[i % reductionLength];
          if (this._phase >= 1.0) {
            this._phase -= 1.0;
            this._lastSampleValue =
              step * Math.floor(input[channel][i] / step + 0.5);
          }
          output[channel][i] = this._lastSampleValue;
        }
      }
    } else {
      // Because we know bitDepth is constant for this call,
      // we can lift the computation of step outside the loop,
      // saving many operations.
      let step = Math.pow(0.5, parameters.bitDepth[0]);
      for (let channel = 0; channel < output.length; ++channel) {
        for (let i = 0; i < output[channel].length; ++i) {
          this._phase += parameters.frequencyReduction[i % reductionLength];
          if (this._phase >= 1.0) {
            this._phase -= 1.0;
            this._lastSampleValue =
              step * Math.floor(input[channel][i] / step + 0.5);
          }
          output[channel][i] = this._lastSampleValue;
        }
      }
    }
    // No need to return a value; this node’s lifetime is dependent only on its
    // input connections.
    
    //return true; // the line above seems WRONG
  }
});
