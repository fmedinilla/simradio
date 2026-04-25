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
    resetState() {
        Object.assign(this, DEFAULT_GENRF_STATE);
    }

    // GENERATOR
    togglePower() {
        this.resetState();
        this.power = !this.power;
    }

    parseInput() {
        if (this.input_mode === GenRFInputMode.NONE) return;

        const value = parseFloat(this.input_value);
        if (isNaN(value)) return;

        switch (this.input_mode) {
            case GenRFInputMode.FREQUENCY:
                this.carrier_freq = value;
                break;
            case GenRFInputMode.AMPLITUDE:
                this.rf.amplitude = value;
                break;
            case GenRFInputMode.MODULATION:
                this.mod.depth = value;
                break;
        }

        this.setInputMode(GenRFInputMode.NONE);
    }

    // UNITS
    mhz() {
        if (!this.power) return;
        if (this.input_mode !== GenRFInputMode.FREQUENCY) return;
        this.input_unit = GenRFUnits.MHZ;
        this.parseInput();
    }

    dBm() {
        if (!this.power) return;
        if (this.input_mode !== GenRFInputMode.AMPLITUDE) return;
        this.input_unit = GenRFUnits.DBM;
        this.parseInput();
    }

    percent() {
        if (!this.power) return;
        if (this.input_mode !== GenRFInputMode.MODULATION) return;
        this.input_unit = GenRFUnits.PERCENT;
        this.parseInput();
    }

    // INPUT
    pressNumpad(value) {
        if (!this.power) return;
        if (this.input_mode === GenRFInputMode.NONE) return;
        this.input_value += value;
        console.log(this.input_value);
    }

    erase() {
        if (!this.power) return;
        if (this.input_mode === GenRFInputMode.NONE) return;
        this.input_value = this.input_value.slice(0, -1);
    }

    // INPUT MODES
    setInputMode(input_mode) {
        if (!this.power) return;
        this.input_mode = input_mode;
        this.input_value = '';
    }
    
    // MODULATION
    toggleModulation() {
        if (!this.power) return;
        this.mod.on = !this.mod.on;
    }

    incrementModulation() {
        if (!this.power) return;
        this.mod.depth = Math.min(100, this.mod.depth + 1);
    }

    decrementModulation() {
        if (!this.power) return;
        this.mod.depth = Math.max(0, this.mod.depth - 1);
    }
    
    // RF
    toggleRf() {
        if (!this.power) return;
        this.rf.on = !this.rf.on;
    }

    incrementRf() {
        if (!this.power) return;
        this.rf.amplitude = Math.min(0, this.rf.amplitude + 1);
    }

    decrementRf() {
        if (!this.power) return;
        this.rf.amplitude = Math.max(-120, this.rf.amplitude - 1);
    }

    // DISPLAY
    modulationDisplay() {
        if (!this.power) return '';
        let displayValue;

        if (this.input_mode === GenRFInputMode.NONE) {
            displayValue = this.mod.depth;
        } else if (this.input_mode === GenRFInputMode.MODULATION) {
            displayValue = this.input_value;
        }

        return displayValue.toString().padStart(2, '!');
    }

    frequencyDisplay() { // 000.000
        if (!this.power) return '';
        let displayValue;

        if (this.input_mode === GenRFInputMode.NONE) {
            displayValue = this.carrier_freq.toFixed(3);
        } else if (this.input_mode === GenRFInputMode.FREQUENCY) {
            displayValue = this.input_value;
        }

        return displayValue.toString().padStart(7, '!');
    }

    amplitudeDisplay() {
        if (!this.power) return '';
        let displayValue;

        if (this.input_mode === GenRFInputMode.NONE) {
            displayValue = this.rf.amplitude;
        } else if (this.input_mode === GenRFInputMode.AMPLITUDE) {
            displayValue = this.input_value;
        }

        return displayValue.toString().padStart(4, '!');
    }


    // OUTPUT
    output() {
        if (!this.power) return RfSignal.empty();
        if (!this.rf.on) return RfSignal.empty();

        return RfSignal.new(
            this.carrier_freq,
            this.rf.amplitude,
            this.mod.on ? this.tone_freq : null,
            this.mod.on ? this.mod.depth : null
        );
    }
}