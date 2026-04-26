class BasebandAudioSignal {
    audio_level = 0;
    audio_freq = 1000;

    constructor(audio_level, audio_freq) {
        this.audio_level = audio_level;
        this.audio_freq = audio_freq;
    }

    static noSignal() {
        return new BasebandAudioSignal(null, null);
    }

    static new(audio_level, audio_freq) {
        return new BasebandAudioSignal(audio_level, audio_freq);
    }
}