document.addEventListener("DOMContentLoaded", function(event) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Function to create Brown noise buffer source
    function createBrownNoise() {
        const bufferSize = 10 * audioCtx.sampleRate;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const brown = Math.random() * 2 - 1;

            output[i] = (lastOut + (0.02 * brown)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
        }

        const brownNoise = audioCtx.createBufferSource();
        brownNoise.buffer = noiseBuffer;
        brownNoise.loop = true;
        return brownNoise;
    }

    // Function to create low-pass filter
    function createLowPassFilterNode(cutoffFrequency) {
        const filterNode = audioCtx.createBiquadFilter();
        filterNode.type = 'lowpass';
        filterNode.frequency.value = cutoffFrequency;
        return filterNode;
    }

    // Function to create high-pass filter
    function createHighPassFilterNode(cutoffFrequency) {
        const filterNode = audioCtx.createBiquadFilter();
        filterNode.type = 'highpass';
        filterNode.frequency.value = cutoffFrequency;
        return filterNode;
    }

    // Connect and play the audio
    function playAudio() {
        const brownNoise = createBrownNoise();
        const lowPassFilter1 = createLowPassFilterNode(400);
        const lowPassFilter2 = createLowPassFilterNode(14);
        const highPassFilter = createHighPassFilterNode(500);

        // Connect the audio nodes
        brownNoise.connect(lowPassFilter1);
        brownNoise.connect(lowPassFilter2);
        lowPassFilter1.connect(highPassFilter);
        lowPassFilter2.connect(highPassFilter);
        highPassFilter.connect(audioCtx.destination);

        brownNoise.start();
    }

    document.getElementById('playButton').addEventListener('click', function() {
        // Start playing the audio
        playAudio();
        // Disable the button after it's clicked to prevent multiple playbacks
        this.disabled = true;
    });
});
