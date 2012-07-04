mamd.define(
    "wrcb.core.AudioSample",
    function () {
        var AudioSample = function (sample) {
            var sample = sample || false,
                playing = false,
                loop = false;

            var play = this.play = function () {
                !!DEBUG && console.log("playing", sample);
                playing = true;
                !!sample && sample.play();
            };

           var stop = this.stop = function () {
                !!DEBUG && console.log("playing", sample);
                playing = false;
                !!sample && sample.stop();
            };

            this.isPlaying = function () {
                return playing;
            };

            this.setLooping = function (l) {
                loop = l;
            };

            this.setVolume = function (v) {
                !!sample && sample.setVolume(v);
            };
        };
        return AudioSample;
    }
);
