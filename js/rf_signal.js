class RfSignal {
    constructor(carrier_freq, rf_power, tone_freq, mod_depth) {
        this.carrier_freq = carrier_freq; // MHz
        this.rf_power = rf_power; // dBm
        this.tone_freq = tone_freq; // Hz
        this.mod_depth = mod_depth; // percent
    }

    static empty() {
        return new RfSignal(null, null, null, null);
    }

    static new(carrier_freq, rf_power, tone_freq, mod_depth) {
        return new RfSignal(carrier_freq, rf_power, tone_freq, mod_depth);
    }
}