mamd.define(
    "wrcb.core.AudioSample",
    function () {
        var AudioSample = function (sample) {
            var sample = sample || false,
                subSamples = [],
                playing = false,
                loop = false;

            var stop = this.stop = function () {
                !!DEBUG && console.log("playing", sample);
                !!sample && sample.stop();
                playing = false;
            };

            var play = this.play = function (subSampleId) {
                !!DEBUG && console.log("playing", sample);
                if (!!sample && sample.loaded) {
                    var start = 0,
                        end = sample.duration;
                    if (!!subSampleId && !!subSamples[subSampleId]) {
                        start = subSamples[subSampleId].start;
                        end = start + subSamples[subSampleId].duration;
                    }
                    sample.setPosition(start);
                    sample.play({
                        whileplaying: function () {
                            if (sample.position  >= end) {
                                if (loop) {
                                    sample.setPosition(start);
                                    sample.resume();
                                } else {
                                    stop();
                                }
                            }
                        }
                    });
                    playing = true;
                }
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

            this.setSubSamples = function (s) {
                subSamples = s;
            };

            this.getSubSamples = function () {
                return subSamples;
            };

            this.setPan = function (p) {
                !!sample && sample.setPan(p);
            };
        };
        return AudioSample;
    }
);
