const GenRFUnits = {
    NONE: '',
    DBM: 'dBm',
    MHZ: 'MHz',
    PERCENT: '%'
}

const GenRFInputMode = {
    NONE: '',
    FREQUENCY: 'frequency',
    AMPLITUDE: 'amplitude',
    MODULATION: 'modulation'
}

const DEFAULT_GENRF_STATE = {
    power: false,
    mod: {
        on: false,
        depth: 0 // percent
    },
    carrier_freq: 0, // MHz
    rf: {
        on: false,
        amplitude: 0 // dBm
    },
    tone_freq: 1000, // Hz
    input_mode: GenRFInputMode.NONE,
    input_value: '',
    input_unit: GenRFUnits.NONE
};

class GenRF {
    onUpdate = () => {
        console.log('GenRF output', this.output());
    }

    state = {};

    // CONSTRUCTOR
    constructor() {
        this.state = { ...DEFAULT_GENRF_STATE };
        this.render();
    }

    // STATE
    updateState(newState) {
        this.state = { ...this.state, ...newState };
        this.onUpdate();
        this.render();
    }

    resetState() {
        this.updateState({ ...DEFAULT_GENRF_STATE });
    }

    // GENERATOR
    togglePower() {
        this.resetState();
        this.updateState({ power: !this.state.power });
    }

    parseInput() {
        if (this.state.input_mode === GenRFInputMode.NONE) return;

        const value = parseFloat(this.state.input_value);
        if (isNaN(value)) return;

        switch (this.state.input_mode) {
            case GenRFInputMode.FREQUENCY:
                this.state.carrier_freq = value;
                break;
            case GenRFInputMode.AMPLITUDE:
                this.state.rf.amplitude = value;
                break;
            case GenRFInputMode.MODULATION:
                this.state.mod.depth = value;
                break;
        }

        this.setInputMode(GenRFInputMode.NONE);
    }

    // UNITS
    mhz() {
        if (!this.state.power) return;
        if (this.state.input_mode !== GenRFInputMode.FREQUENCY) return;
        this.updateState({ input_unit: GenRFUnits.MHZ });
        this.parseInput();
    }

    dBm() {
        if (!this.state.power) return;
        if (this.state.input_mode !== GenRFInputMode.AMPLITUDE) return;
        this.updateState({ input_unit: GenRFUnits.DBM });
        this.parseInput();
    }

    percent() {
        if (!this.state.power) return;
        if (this.state.input_mode !== GenRFInputMode.MODULATION) return;
        this.updateState({ input_unit: GenRFUnits.PERCENT });
        this.parseInput();
    }

    // INPUT
    pressNumpad(value) {
        if (!this.state.power) return;
        if (this.state.input_mode === GenRFInputMode.NONE) return;
        this.updateState({ input_value: this.state.input_value + value });
    }

    erase() {
        if (!this.state.power) return;
        if (this.state.input_mode === GenRFInputMode.NONE) return;
        this.updateState({ input_value: this.state.input_value.slice(0, -1) });
    }

    // INPUT MODES
    setInputMode(input_mode) {
        if (!this.state.power) return;
        this.updateState({ input_mode, input_value: '' });
    }
    
    // MODULATION
    toggleModulation() {
        if (!this.state.power) return;
        this.updateState({ mod: { ...this.state.mod, on: !this.state.mod.on } });
    }

    incrementModulation() {
        if (!this.state.power) return;
        this.updateState({ mod: { ...this.state.mod, depth: Math.min(100, this.state.mod.depth + 1) } });
    }

    decrementModulation() {
        if (!this.state.power) return;
        this.updateState({ mod: { ...this.state.mod, depth: Math.max(0, this.state.mod.depth - 1) } });
    }
    
    // RF
    toggleRf() {
        if (!this.state.power) return;
        this.updateState({ rf: { ...this.state.rf, on: !this.state.rf.on } });
    }

    incrementRf() {
        if (!this.state.power) return;
        this.updateState({ rf: { ...this.state.rf, amplitude: Math.min(0, this.state.rf.amplitude + 1) } });
    }

    decrementRf() {
        if (!this.state.power) return;
        this.updateState({ rf: { ...this.state.rf, amplitude: Math.max(-120, this.state.rf.amplitude - 1) } });
    }

    // DISPLAY
    modulationDisplay() {
        if (!this.state.power) return '';
        let displayValue;

        if (this.state.input_mode === GenRFInputMode.NONE) {
            displayValue = this.state.mod.depth;
        } else if (this.state.input_mode === GenRFInputMode.MODULATION) {
            displayValue = this.state.input_value;
        }

        return displayValue.toString().padStart(2, '!');
    }

    frequencyDisplay() { // 000.000
        if (!this.state.power) return '';
        let displayValue;

        if (this.state.input_mode === GenRFInputMode.NONE) {
            displayValue = this.state.carrier_freq.toFixed(3);
        } else if (this.state.input_mode === GenRFInputMode.FREQUENCY) {
            displayValue = this.state.input_value;
        }

        return displayValue.toString().padStart(7, '!');
    }

    amplitudeDisplay() {
        if (!this.state.power) return '';
        let displayValue;

        if (this.state.input_mode === GenRFInputMode.NONE) {
            displayValue = this.state.rf.amplitude;
        } else if (this.state.input_mode === GenRFInputMode.AMPLITUDE) {
            displayValue = this.state.input_value;
        }

        return displayValue.toString().padStart(4, '!');
    }

    connect(onUpdate) {
        this.onUpdate = onUpdate;
    }

    // RENDER
    render() {
        const $container = document.getElementById('genrf-container');
        $container.innerHTML = '';

        const $image = document.createElement('img');
        $image.src = 'assets/genrf.jpeg';
        $container.appendChild($image);

        // display modulation
        const $displayModulation = document.createElement('div');
        $displayModulation.classList.add('display');
        $displayModulation.id = 'genrf__display-modulation'

        const $displaybackModulation = document.createElement('div');
        $displaybackModulation.classList.add('display-back');
        $displaybackModulation.innerText = '88';
        $displayModulation.appendChild($displaybackModulation);

        const $displayfrontModulation = document.createElement('div');
        $displayfrontModulation.classList.add('display-front');
        $displayfrontModulation.innerText = this.modulationDisplay();
        $displayModulation.appendChild($displayfrontModulation);
        $container.appendChild($displayModulation);

        // display frequency
        const $displayFrequency = document.createElement('div');
        $displayFrequency.classList.add('display');
        $displayFrequency.id = 'genrf__display-frequency'

        const $displaybackFrequency = document.createElement('div');
        $displaybackFrequency.classList.add('display-back');
        $displaybackFrequency.innerText = '888.888';
        $displayFrequency.appendChild($displaybackFrequency);

        const $displayfrontFrequency = document.createElement('div');
        $displayfrontFrequency.classList.add('display-front');
        $displayfrontFrequency.innerText = this.frequencyDisplay();
        $displayFrequency.appendChild($displayfrontFrequency);
        $container.appendChild($displayFrequency);

        // display amplitude
        const $displayAmplitude = document.createElement('div');
        $displayAmplitude.classList.add('display');
        $displayAmplitude.id = 'genrf__display-amplitude'

        const $displaybackAmplitude = document.createElement('div');
        $displaybackAmplitude.classList.add('display-back');
        $displaybackAmplitude.innerText = '8888';
        $displayAmplitude.appendChild($displaybackAmplitude);

        const $displayfrontAmplitude = document.createElement('div');
        $displayfrontAmplitude.classList.add('display-front');
        $displayfrontAmplitude.innerText = this.amplitudeDisplay();
        $displayAmplitude.appendChild($displayfrontAmplitude);
        $container.appendChild($displayAmplitude);
    }

    // OUTPUT
    output() {
        if (!this.state.power) return RfSignal.empty();
        if (!this.state.rf.on) return RfSignal.empty();

        return RfSignal.new(
            this.state.carrier_freq,
            this.state.rf.amplitude,
            this.state.mod.on ? this.state.tone_freq : null,
            this.state.mod.on ? this.state.mod.depth : null
        );
    }
}