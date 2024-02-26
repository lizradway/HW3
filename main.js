document.addEventListener("DOMContentLoaded", function(event) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
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

    function createLowPassFilterNode(cutoffFrequency) {
        const filterNode = audioCtx.createBiquadFilter();
        filterNode.type = 'lowpass';
        filterNode.frequency.value = cutoffFrequency;
        return filterNode;
    }


    function createHighPassFilterNode(cutoffFrequency) {
        const filterNode = audioCtx.createBiquadFilter();
        filterNode.type = 'highpass';
        filterNode.frequency.value = cutoffFrequency;
        return filterNode;
    }

    function playBabblingBrook() {
        const brownNoise = createBrownNoise();
        const lowPassFilter1 = createLowPassFilterNode(400);
        const lowPassFilter2 = createLowPassFilterNode(14);
        const highPassFilter = createHighPassFilterNode(500);

        brownNoise.connect(lowPassFilter1);
        brownNoise.connect(lowPassFilter2);
        lowPassFilter1.connect(highPassFilter);
        lowPassFilter2.connect(highPassFilter);
        highPassFilter.connect(audioCtx.destination);

        brownNoise.start();
    }

    function playSingularBounce() {
        const audioCtx = new AudioContext();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
    
        oscillator.type = 'sine';
        
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(200, audioCtx.currentTime + 0.1);
        oscillator.frequency.linearRampToValueAtTime(300, audioCtx.currentTime + 0.2);
        oscillator.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.3);
        oscillator.frequency.linearRampToValueAtTime(150, audioCtx.currentTime + 0.4);
        
        oscillator.connect(gainNode);
    
        gainNode.connect(audioCtx.destination);
        gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5); 
    
        oscillator.start(audioCtx.currentTime); 
        oscillator.stop(audioCtx.currentTime + 0.5);
    }


    document.getElementById('playButton').addEventListener('click', function() {
        playBabblingBrook();
        this.disabled = true;
    });

    document.getElementById('bounceButton').addEventListener('click', function() {
        setInterval(() => {
            playSingularBounce();
        }, 750);
        this.disabled = true;
    });
});
