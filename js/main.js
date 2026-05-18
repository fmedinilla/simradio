const genrf = new GenRF();
const transceiver = new Transceiver();
const tims = new TIMS();

genrf.connect((rfSignal) => {
    transceiver.input(rfSignal);
});

transceiver.connect((audioSignal) => {
    tims.processSignal(audioSignal);
});
