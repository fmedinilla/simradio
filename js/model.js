function processSignal({rf_power, carrier_freq, tone, depth, is_muted, agc_enabled, af_level, sq_level}) {
    const BASE_SQ_LEVEL = -98;
    const SQ_HISTERESIS = localStorage.getItem("histVal") || 13;
    const SENSIBILITY = localStorage.getItem("sensVal") || -102;
    
    const SQ_OPEN = sq_level; // dBm
    const SQ_CLOSE = SQ_OPEN - SQ_HISTERESIS; // dBm

    // Validar señal
    if (rf_power === null) {
        return {
            out_level: null,
            is_muted: true,
            tone: null
        }
    }

    // Procesamiento señal
    if (rf_power <= SQ_CLOSE) is_muted = true;
    else if (rf_power >= SQ_OPEN) is_muted = false;

    let signal_level = 20 * Math.log10(depth/85); // -9.04

    if (!agc_enabled) {
        signal_level += (rf_power - (BASE_SQ_LEVEL));
    }

    let noise_level;
    if (agc_enabled) {
        noise_level = -19.04;
    } else {
        noise_level = SENSIBILITY - (BASE_SQ_LEVEL) + (-19.04);
    }

    let out_level = is_muted ? -40.7 : Math.max(signal_level, noise_level);
    out_level += af_level;

    return { 
        out_level,
        is_muted,
        tone
    };
}

const MODEL = {
    version: '1.0',
    processSignal: processSignal
}