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
        amplitude: -150 // dBm
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
        this.onUpdate(this.output());
        this.render();
        console.log('GenRF state', this.state);
    }

    resetState() {
        this.updateState({ ...DEFAULT_GENRF_STATE });
    }

    // GENERATOR
    togglePower() {
        const lastPowerState = this.state.power;
        this.resetState();
        this.updateState({ power: !lastPowerState });
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

        if (input_mode === GenRFInputMode.MODULATION) {
            this.toggleModulation(true);
        } else if (input_mode === GenRFInputMode.AMPLITUDE) {
            this.toggleRf(true);
        }

        this.updateState({ input_mode, input_value: '', input_unit: GenRFUnits.NONE });
    }
    
    // MODULATION
    toggleModulation(forced = null) {
        if (!this.state.power) return;
        if (forced !== null) {
            this.updateState({ mod: { ...this.state.mod, on: forced } });
            return;
        }
        this.updateState({ mod: { ...this.state.mod, on: !this.state.mod.on } });
    }

    incrementModulation() {
        if (!this.state.power) return;
        this.updateState({ mod: { ...this.state.mod, depth: Math.min(99, this.state.mod.depth + 1) } });
    }

    decrementModulation() {
        if (!this.state.power) return;
        this.updateState({ mod: { ...this.state.mod, depth: Math.max(0, this.state.mod.depth - 1) } });
    }
    
    // RF
    toggleRf(forced = null) {
        if (!this.state.power) return;
        if (forced !== null) {
            this.updateState({ rf: { ...this.state.rf, on: forced } });
            return;
        }
        this.updateState({ rf: { ...this.state.rf, on: !this.state.rf.on } });
    }

    incrementRf() {
        if (!this.state.power) return;
        this.updateState({ rf: { ...this.state.rf, amplitude: Math.min(0, this.state.rf.amplitude + 1) } });
    }

    decrementRf() {
        if (!this.state.power) return;
        this.updateState({ rf: { ...this.state.rf, amplitude: Math.max(-200, this.state.rf.amplitude - 1) } });
    }

    // DISPLAY
    modulationDisplay() {
        if (!this.state.power) return '';
        if (!this.state.mod.on) return '';

        let displayValue = "";

        if (this.state.input_mode === GenRFInputMode.MODULATION) {
             displayValue = this.state.input_value;
        } else {
            displayValue = this.state.mod.depth;
        }

        return displayValue.toString().padStart(2, '!');
    }

    frequencyDisplay() { // 000.000
        if (!this.state.power) return '';
        let displayValue = "";

        if (this.state.input_mode === GenRFInputMode.FREQUENCY) {
            displayValue = (+this.state.input_value).toFixed(3);
        } else {
            displayValue = this.state.carrier_freq.toFixed(3);
        }

        return displayValue.toString().padStart(7, '!');
    }

    amplitudeDisplay() {
        if (!this.state.power) return '';
        if (!this.state.rf.on) return '';

        let displayValue = "";

        if (this.state.input_mode === GenRFInputMode.AMPLITUDE) {
            displayValue = this.state.input_value;
        } else {
            displayValue = this.state.rf.amplitude;
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

        // power button
        const $powerButton = document.createElement('button');
        $powerButton.id = 'genrf__power-button';
        $powerButton.classList.add('button', 'button--small');
        $powerButton.innerText = 'ON';
        $powerButton.addEventListener('click', () => {
            this.togglePower();
        });
        $container.appendChild($powerButton);

        // am modulation button
        const $modButton = document.createElement('button');
        $modButton.id = 'genrf__mod-button';
        $modButton.classList.add('button', 'button--square');
        $modButton.innerText = 'AM';
        $modButton.addEventListener('click', () => {
            this.setInputMode(GenRFInputMode.MODULATION);
        });
        $container.appendChild($modButton);

        // toggle modulation button
        const $toggleModButton = document.createElement('button');
        $toggleModButton.id = 'genrf__toggle-mod-button';
        $toggleModButton.classList.add('button', 'button--small');
        $toggleModButton.innerText = 'OFF';
        $toggleModButton.addEventListener('click', () => {
            this.toggleModulation();
        });
        $container.appendChild($toggleModButton);

        // increment modulation button
        const $incrementModButton = document.createElement('button');
        $incrementModButton.id = 'genrf__increment-mod-button';
        $incrementModButton.classList.add('button', 'button--small');
        $incrementModButton.innerText = '+';
        $incrementModButton.addEventListener('click', () => {
            this.incrementModulation();
        });
        $container.appendChild($incrementModButton);

        // decrement modulation button
        const $decrementModButton = document.createElement('button');
        $decrementModButton.id = 'genrf__decrement-mod-button';
        $decrementModButton.classList.add('button', 'button--small');
        $decrementModButton.innerText = '-';
        $decrementModButton.addEventListener('click', () => {
            this.decrementModulation();
        });
        $container.appendChild($decrementModButton);

        // frequency button
        const $frequencyButton = document.createElement('button');
        $frequencyButton.id = 'genrf__frequency-button';
        $frequencyButton.classList.add('button', 'button--large');
        $frequencyButton.innerText = 'FREQUENCY';
        $frequencyButton.addEventListener('click', () => {
            this.setInputMode(GenRFInputMode.FREQUENCY);
        });
        $container.appendChild($frequencyButton);

        // amplitude button
        const $amplitudeButton = document.createElement('button');
        $amplitudeButton.id = 'genrf__amplitude-button';
        $amplitudeButton.classList.add('button', 'button--square');
        $amplitudeButton.innerText = 'AMPTD';
        $amplitudeButton.addEventListener('click', () => {
            this.setInputMode(GenRFInputMode.AMPLITUDE);
        });
        $container.appendChild($amplitudeButton);

        // toggle rf button
        const $toggleRfButton = document.createElement('button');
        $toggleRfButton.id = 'genrf__toggle-rf-button';
        $toggleRfButton.classList.add('button', 'button--small');
        $toggleRfButton.innerText = 'RF OFF';
        $toggleRfButton.addEventListener('click', () => {
            this.toggleRf();
        });
        $container.appendChild($toggleRfButton);

        // increment amplitude button
        const $incrementAmplitudeButton = document.createElement('button');
        $incrementAmplitudeButton.id = 'genrf__increment-amplitude-button';
        $incrementAmplitudeButton.classList.add('button', 'button--small');
        $incrementAmplitudeButton.innerText = '+';
        $incrementAmplitudeButton.addEventListener('click', () => {
            this.incrementRf();
        });
        $container.appendChild($incrementAmplitudeButton);

        // decrement amplitude button
        const $decrementAmplitudeButton = document.createElement('button');
        $decrementAmplitudeButton.id = 'genrf__decrement-amplitude-button';
        $decrementAmplitudeButton.classList.add('button', 'button--small');
        $decrementAmplitudeButton.innerText = '-';
        $decrementAmplitudeButton.addEventListener('click', () => {
            this.decrementRf();
        });
        $container.appendChild($decrementAmplitudeButton);

        // numpad 7 button
        const $numpad7Button = document.createElement('button');
        $numpad7Button.id = 'genrf__numpad-7-button';
        $numpad7Button.classList.add('button', 'button--small');
        $numpad7Button.innerText = '7';
        $numpad7Button.addEventListener('click', () => {
            this.pressNumpad('7');
        });
        $container.appendChild($numpad7Button);

        // numpad 4 button
        const $numpad4Button = document.createElement('button');
        $numpad4Button.id = 'genrf__numpad-4-button';
        $numpad4Button.classList.add('button', 'button--small');
        $numpad4Button.innerText = '4';
        $numpad4Button.addEventListener('click', () => {
            this.pressNumpad('4');
        });
        $container.appendChild($numpad4Button);

        // numpad 1 button
        const $numpad1Button = document.createElement('button');
        $numpad1Button.id = 'genrf__numpad-1-button';
        $numpad1Button.classList.add('button', 'button--small');
        $numpad1Button.innerText = '1';
        $numpad1Button.addEventListener('click', () => {
           this.pressNumpad('1'); 
        });
        $container.appendChild($numpad1Button);

        // numpad 0 button
        const $numpad0Button = document.createElement('button');
        $numpad0Button.id = 'genrf__numpad-0-button';
        $numpad0Button.classList.add('button', 'button--small');
        $numpad0Button.innerText = '0';
        $numpad0Button.addEventListener('click', () => {
            this.pressNumpad('0');
        });
        $container.appendChild($numpad0Button);

        // numpad 8 button
        const $numpad8Button = document.createElement('button');
        $numpad8Button.id = 'genrf__numpad-8-button';
        $numpad8Button.classList.add('button', 'button--small');
        $numpad8Button.innerText = '8';
        $numpad8Button.addEventListener('click', () => {
            this.pressNumpad('8');
        });
        $container.appendChild($numpad8Button);

        // numpad 5 button
        const $numpad5Button = document.createElement('button');
        $numpad5Button.id = 'genrf__numpad-5-button';
        $numpad5Button.classList.add('button', 'button--small');
        $numpad5Button.innerText = '5';
        $numpad5Button.addEventListener('click', () => {
            this.pressNumpad('5');
        });
        $container.appendChild($numpad5Button);

        // numpad 2 button
        const $numpad2Button = document.createElement('button');
        $numpad2Button.id = 'genrf__numpad-2-button';
        $numpad2Button.classList.add('button', 'button--small');
        $numpad2Button.innerText = '2';
        $numpad2Button.addEventListener('click', () => {
            this.pressNumpad('2');
        });
        $container.appendChild($numpad2Button);

        // numpad dot button
        const $numpadDotButton = document.createElement('button');
        $numpadDotButton.id = 'genrf__numpad-dot-button';
        $numpadDotButton.classList.add('button', 'button--small');
        $numpadDotButton.innerText = '.';
        $numpadDotButton.addEventListener('click', () => {
            this.pressNumpad('.');
        });
        $container.appendChild($numpadDotButton);

        // numpad 9 button
        const $numpad9Button = document.createElement('button');
        $numpad9Button.id = 'genrf__numpad-9-button';
        $numpad9Button.classList.add('button', 'button--small');
        $numpad9Button.innerText = '9';
        $numpad9Button.addEventListener('click', () => {
            this.pressNumpad('9');
        });
        $container.appendChild($numpad9Button);

        // numpad 6 button
        const $numpad6Button = document.createElement('button');
        $numpad6Button.id = 'genrf__numpad-6-button';
        $numpad6Button.classList.add('button', 'button--small');
        $numpad6Button.innerText = '6';
        $numpad6Button.addEventListener('click', () => {
            this.pressNumpad('6');
        });
        $container.appendChild($numpad6Button);

        // numpad 3 button
        const $numpad3Button = document.createElement('button');
        $numpad3Button.id = 'genrf__numpad-3-button';
        $numpad3Button.classList.add('button', 'button--small');
        $numpad3Button.innerText = '3';
        $numpad3Button.addEventListener('click', () => {
            this.pressNumpad('3');
        });
        $container.appendChild($numpad3Button);

        // numpad minus button
        const $numpadMinusButton = document.createElement('button');
        $numpadMinusButton.id = 'genrf__numpad-minus-button';
        $numpadMinusButton.classList.add('button', 'button--small');
        $numpadMinusButton.innerText = '-';
        $numpadMinusButton.addEventListener('click', () => {
            this.pressNumpad('-');
        });
        $container.appendChild($numpadMinusButton);

        // dbm button
        const $numpadDbmButton = document.createElement('button');
        $numpadDbmButton.id = 'genrf__dbm-button';
        $numpadDbmButton.classList.add('button', 'button--small');
        $numpadDbmButton.innerText = 'dBm';
        $numpadDbmButton.addEventListener('click', () => {
            this.dBm();
        });
        $container.appendChild($numpadDbmButton);

        // mhz button
        const $numpadMhzButton = document.createElement('button');
        $numpadMhzButton.id = 'genrf__mhz-button';
        $numpadMhzButton.classList.add('button', 'button--small');
        $numpadMhzButton.innerText = 'MHz';
        $numpadMhzButton.addEventListener('click', () => {
            this.mhz();
        });
        $container.appendChild($numpadMhzButton);

        // percent button
        const $numpadPercentButton = document.createElement('button');
        $numpadPercentButton.id = 'genrf__percent-button';
        $numpadPercentButton.classList.add('button', 'button--small');
        $numpadPercentButton.innerText = '%';
        $numpadPercentButton.addEventListener('click', () => {
            this.percent();
        });
        $container.appendChild($numpadPercentButton);

        // erase button
        const $numpadEraseButton = document.createElement('button');
        $numpadEraseButton.id = 'genrf__erase-button';
        $numpadEraseButton.classList.add('button', 'button--small');
        $numpadEraseButton.innerText = 'Erase';
        $numpadEraseButton.addEventListener('click', () => {
            alert('Erase button clicked');
        });
        $container.appendChild($numpadEraseButton);
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