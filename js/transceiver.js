class Transceiver {
    on = false;
    remote = false;
    sq_level = 0;
    agc_enabled = true;
    af_level = 0;
    frequency = 300.00; // MHz
    is_muted = true;

    rfSignal = RfSignal.empty();
    basebandAudioSignal = BasebandAudioSignal.noSignal();

    togglePower() {
        this.on = !this.on;
    }

    setAgc(enabled) {
        this.agc_enabled = enabled;
    }

    toggleRemote() {
        this.remote = !this.remote;
    }

    setSqLevel(level) {
        this.sq_level = level;
    }

    setAfLevel(level) {
        this.af_level = level;
    }

    setFrequency(freq) {
        this.frequency = freq;
    }

    input(rfSignal) {
        if (!this.on) {
            console.warn('Transceiver is off. Ignoring input signal.');
            return;
        }

        this.rfSignal = rfSignal;
        this.processSignal();
    }

    processSignal() {
        const {carrier_freq, rf_power, tone_freq, mod_depth} = this.rfSignal;
        const processedSignal = MODEL.processSignal({
            rf_power: rf_power,
            carrier_freq: carrier_freq,
            tone: tone_freq,
            depth: mod_depth,
            is_muted: this.is_muted,
            agc_enabled: this.agc_enabled,

            af_level: this.af_level,
            sq_level: this.sq_level
        });

        this.is_muted = processedSignal.is_muted;
        this.basebandAudioSignal = BasebandAudioSignal.new(processedSignal.out_level, processedSignal.tone);

        console.log('Transceiver::processedSignal', processedSignal);
    }

    output() {
        if (!this.on) {
            console.warn('Transceiver is off. Ignoring output request.');
            return BasebandAudioSignal.noSignal();
        }

        return this.basebandAudioSignal;
    }
}