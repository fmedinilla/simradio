class Transceiver {
    state = {
        on: false,
        remote: false,
        sq_level: 0,
        agc_enabled: true,
        af_level: 0,
        frequency: 300.00, // MHz
        is_muted: true,
        rfSignal: RfSignal.empty(),
        basebandAudioSignal: BasebandAudioSignal.noSignal()
    }

    onUpdate = () => {
        console.log('Transceiver output', this.output());
    };

    constructor() {
        this.render();
    }

    // STATE
    updateState(newState) {
        this.state = {...this.state, ...newState};
        this.onUpdate();
        this.render();
    }

    togglePower() {
        this.updateState({ on: !this.state.on });
    }

    setAgc(enabled) {
        this.updateState({ agc_enabled: enabled });
    }

    toggleRemote() {
        this.updateState({ remote: !this.state.remote });
    }

    setSqLevel(level) {
        this.updateState({ sq_level: level });
    }

    setAfLevel(level) {
        this.updateState({ af_level: level });
    }

    setFrequency(freq) {
        this.updateState({ frequency: freq });
    }

    input(rfSignal) {
        if (!this.state.on) {
            console.warn('Transceiver is off. Ignoring input signal.');
            return;
        }

        this.updateState({ rfSignal });
        this.processSignal();
    }

    processSignal() {
        const {carrier_freq, rf_power, tone_freq, mod_depth} = this.state.rfSignal;
        const processedSignal = MODEL.processSignal({
            rf_power: rf_power,
            carrier_freq: carrier_freq,
            tone: tone_freq,
            depth: mod_depth,
            is_muted: this.state.is_muted,
            agc_enabled: this.state.agc_enabled,

            af_level: this.state.af_level,
            sq_level: this.state.sq_level
        });

        this.updateState({ is_muted: processedSignal.is_muted });
        this.updateState({ basebandAudioSignal: BasebandAudioSignal.new(processedSignal.out_level, processedSignal.tone) });
    }

    connect(onUpdate) {
        this.onUpdate = onUpdate;
    }

    // RENDER
    render() {
        const $container = document.getElementById('transceiver-container');
        
        fetch('templates/transceiver.html')
            .then(response => response.text())
            .then(html => {
                $container.innerHTML = html;
            })
            .catch(error => console.error('Error loading transceiver template:', error));
    }

    output() {
        if (!this.state.on) {
            console.warn('Transceiver is off. Ignoring output request.');
            return BasebandAudioSignal.noSignal();
        }

        return this.state.basebandAudioSignal;
    }
}