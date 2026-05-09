function initPotentiometer(potId, onChange) {
    // 1. Buscamos el contenedor principal por su ID
    const container = document.getElementById(potId);
    if (!container) return; // Si no existe en el HTML, no hacemos nada

    // 2. Buscamos las partes específicas SOLO DENTRO de este contenedor
    const knob = container.querySelector(".pot-knob");
    const ticksContainer = container.querySelector(".pot-ticks");
    const valueDisplay = container.querySelector(".pot-value");

    // Configuración
    const MIN_ANGLE = -135;
    const MAX_ANGLE = 135;
    const TOTAL_ANGLE = MAX_ANGLE - MIN_ANGLE;
    const NUM_TICKS = 25;

    // Variables de estado únicas para ESTE potenciómetro en concreto
    let isDragging = false;
    let currentAngle = MIN_ANGLE;
    let lastY = 0;

    // Generar rayitas
    function createTicks() {
        ticksContainer.innerHTML = '';
        const step = TOTAL_ANGLE / (NUM_TICKS - 1);
        for (let i = 0; i < NUM_TICKS; i++) {
            const tickAngle = MIN_ANGLE + (i * step);
            const tick = document.createElement("div");
            tick.classList.add("tick");
            tick.style.transform = `rotate(${tickAngle}deg)`;
            tick.dataset.angle = tickAngle;
            ticksContainer.appendChild(tick);
        }
    }

    // Actualizar luces
    function updateTicksVisuals(angle) {
        // Buscamos los ticks solo dentro de este contenedor
        const ticks = ticksContainer.querySelectorAll(".tick");
        ticks.forEach(tick => {
            const tickAngle = parseFloat(tick.dataset.angle);
            if (tickAngle <= angle + 0.5) {
                tick.classList.add("active");
            } else {
                tick.classList.remove("active");
            }
        });
    }

    // Rotar y calcular valor
    function setAngle(angle) {
        currentAngle = Math.max(MIN_ANGLE, Math.min(MAX_ANGLE, angle));
        knob.style.transform = `rotate(${currentAngle}deg)`;

        const percentage = ((currentAngle - MIN_ANGLE) / TOTAL_ANGLE) * 100;
        valueDisplay.textContent = `${percentage.toFixed(1)}%`;

        if (percentage > 0) {
            valueDisplay.style.color = "#39ff14";
            valueDisplay.style.textShadow = "0 0 5px rgba(57, 255, 20, 0.4)";
        } else {
            valueDisplay.style.color = "#888";
            valueDisplay.style.textShadow = "none";
        }

        updateTicksVisuals(currentAngle);
    }

    // Eventos del ratón
    knob.addEventListener("mousedown", (e) => {
        isDragging = true;
        lastY = e.clientY;
        document.body.style.cursor = "ns-resize";
        e.preventDefault();
    });

    // Usamos window para que no se "atasque" si el ratón sale rápido de la perilla
    window.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.cursor = "default";
        }
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        const deltaY = lastY - e.clientY;
        lastY = e.clientY;

        const sensitivity = e.shiftKey ? 0.2 : 1.5;
        const newAngle = currentAngle + (deltaY * sensitivity);

        setAngle(newAngle);
        onChange(newAngle);
    });

    knob.addEventListener("dblclick", () => {
        setAngle(0);
    });

    // Inicializar este potenciómetro al cargar
    createTicks();
    setAngle(MIN_ANGLE);

    return setAngle
}

class Transceiver {
    state = {
        on: false,
        remote: false,
        sq_level: -135,
        agc_enabled: true,
        af_level: -135,
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
        this.state = { ...this.state, ...newState };
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
        const { carrier_freq, rf_power, tone_freq, mod_depth } = this.state.rfSignal;
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

                const setAfAngle = initPotentiometer("af-pot", (angle) => {
                    this.updateState({ af_level: angle });
                });
                const setSqAngle = initPotentiometer("sq-pot", (angle) => {
                    this.updateState({ sq_level: angle });
                });

                setAfAngle(this.state.af_level);
                setSqAngle(this.state.sq_level);

                const $display = document.getElementById('transceptor-display');
                const $powerSwitch = document.getElementById('transceptor-power');
                const $remoteSwitch = document.getElementById('transceptor-remote');
                const $agcSwitch = document.getElementById('transceptor-agc');

                $agcSwitch.checked = this.state.agc_enabled;
                $agcSwitch.addEventListener('change', () => this.setAgc($agcSwitch.checked));

                $remoteSwitch.checked = this.state.remote;
                $remoteSwitch.addEventListener('change', () => this.toggleRemote());

                $powerSwitch.checked = this.state.on;
                $powerSwitch.addEventListener('change', () => this.togglePower());

                if (this.state.on) {
                    $display.classList.remove('off');
                    $display.classList.add('on');
                    $display.querySelector('#transceptor-freq').textContent =  this.state.frequency.toFixed(3);
                } else {
                    $display.classList.remove('on');
                    $display.classList.add('off');
                    $display.querySelector('#transceptor-freq').textContent =  '-';

                    $remoteSwitch.disabled = true;
                    $agcSwitch.disabled = true;
                }
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