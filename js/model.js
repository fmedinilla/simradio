function processSignal({rf_power, carrier_freq, tone, depth, is_muted, agc_enabled, af_level, sq_level}) {
    const BASE_SQ_LEVEL = -98;
    const SQ_HISTERESIS = 13; // dB
    const SENSIBILITY = -102; // dBm
    
    const SQ_OPEN = BASE_SQ_LEVEL + sq_level; // dBm
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
        signal_level += (rf_power - (-98));
    }

    let noise_level;
    if (agc_enabled) {
        noise_level = -19.04;
    } else {
        noise_level = SENSIBILITY - (-98) + (-19.04);
    }

    let out_level = is_muted ? -100 : Math.max(signal_level, noise_level);
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