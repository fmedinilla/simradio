class TimsAudioMonitor {
    constructor() {
        // Inicializamos el contexto de audio
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        
        // 1. Crear el Tono (1 kHz)
        this.oscillator = this.ctx.createOscillator();
        this.oscillator.type = 'sine'; // Tono puro
        this.oscillator.frequency.value = 1000; // 1 kHz
        
        // 2. Crear el Ruido Blanco
        const bufferSize = this.ctx.sampleRate * 2; // 2 segundos de buffer
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1; // Valores entre -1 y 1
        }
        this.noiseSource = this.ctx.createBufferSource();
        this.noiseSource.buffer = noiseBuffer;
        this.noiseSource.loop = true; // Que el ruido suene infinitamente

        // 3. Crear los Nodos de Ganancia (Volumen)
        this.toneGain = this.ctx.createGain();
        this.noiseGain = this.ctx.createGain();
        this.masterGain = this.ctx.createGain(); // Volumen general

        // Inicializar ambos en 0 para que no suenen al empezar
        this.toneGain.gain.value = 0;
        this.noiseGain.gain.value = 0;
        this.masterGain.gain.value = 0.5; // Ajusta el volumen general (0.0 a 1.0) para no lastimar oídos

        // 4. Conectar los nodos (El "Cableado" del TIMS)
        this.oscillator.connect(this.toneGain);
        this.noiseSource.connect(this.noiseGain);
        
        this.toneGain.connect(this.masterGain);
        this.noiseGain.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination); // Salida a los altavoces
    }

    start() {
        // Los navegadores requieren que el audio inicie tras una interacción del usuario (ej. un clic)
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        this.oscillator.start();
        this.noiseSource.start();

    }

    stop() {
        this.oscillator.stop();
        this.noiseSource.stop();
    }

    toggle() {
        if (this.ctx.state === 'running') {
            this.ctx.suspend();
        } else {
            this.ctx.resume();
        }
    }

    /**
     * Llama a esta función constantemente cuando cambie tu output_level
     * @param {number} signalQuality - Nivel de calidad de señal (0.0 = Solo Ruido, 1.0 = Tono Puro perfecto)
     */
    updateLevel(signalQuality) {
        // Aseguramos que el valor esté entre 0 y 1
        const quality = Math.max(0, Math.min(1, signalQuality)); 
        
        // Usamos setTargetAtTime para evitar "chasquidos" (clicks) cuando los valores cambian rápido.
        // El 0.05 es la constante de tiempo (50ms), hace que la transición de volumen sea suave.
        const now = this.ctx.currentTime;
        const timeConstant = 0.05;

        const noiseLevel = Math.pow(1 - quality, 3); // El ruido disminuye cuadráticamente para que el cambio sea más perceptible

        // Mezcla cruzada (Crossfade linear)
        this.toneGain.gain.setTargetAtTime(quality, now, timeConstant);
        this.noiseGain.gain.setTargetAtTime(noiseLevel, now, timeConstant);
    }

    changeFreq(audio_freq) {
        this.oscillator.frequency.setTargetAtTime(audio_freq, this.ctx.currentTime, 0.05);
    }
}

class TIMS {
    monitorStarted = false;
    audioMonitor = new TimsAudioMonitor();

    processSignal(basebandAudioSignal) {
        const MAX_LEVEL = 6;
        const MIN_LEVEL = -35;

        const audioMonitor = new TimsAudioMonitor();

        const audio_level = basebandAudioSignal.audio_level;
        const audio_freq = basebandAudioSignal.audio_freq;

        let signalQuality = (audio_level - MIN_LEVEL) / (MAX_LEVEL - MIN_LEVEL); // Valor entre 0.0 y 1.0
        this.audioMonitor.updateLevel(signalQuality);
        this.audioMonitor.changeFreq(audio_freq);
    }

    turnOnTIMS() {
        if (!this.monitorStarted) {
            this.audioMonitor.start();
            this.monitorStarted = true;
            return;
        }

        this.audioMonitor.toggle();
    }
}