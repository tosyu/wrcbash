mamd.define(
    "wrcb.core.AudioSample",
    function () {
        var AudioSample = function (sample) {
            var sample = sample || false,
                subSamples = [],
                playing = false,
                loop = false,
                crossfadingLoop = false,
                currentSample = null;

            var stop = this.stop = function () {
                !!DEBUG && console.log("stopping", sample);
                !!currentSample && currentSample.stop();
                playing = false;
            };

            var play = this.play = function (subSampleId, _sample) {
                var s = _sample || sample;
                !!DEBUG && console.log("playing", s, s.loaded);
                if (!!s && s.loaded) {
                    var start = 0,
                        end = s.duration;
                    if (!!subSampleId && !!subSamples[subSampleId]) {
                        start = subSamples[subSampleId][0];
                        end = subSamples[subSampleId][1];
                    }
                    if (loop && crossfadingLoop && !_sample) {
                        s.setVolume(0);
                    }
                    s.play({
                        "loops": 0,
                        "offset": start,
                        "whileplaying": function () {
                            if (loop && crossfadingLoop) {
                                var perc = s.position / end * 100,
                                    vol = 0,
                                    cs = null;
                                switch (true) {
                                case !s._fadeIn && (perc < 5 || (s.position < 1500 && s.duration < 3000)):
                                    s._fadeIn = function () {
                                        if (s.volume < 100) {
                                            s.setVolume(s.volume + 25);
                                            window.setTimeout(s._fadeIn, 100);
                                        }
                                    };
                                    s._fadeIn();
                                    break;
                                case !s._fadeOut && (perc > 90 || (s.position > 1500 && s.duration < 3000)):
                                    s._fadeOut = function () {
                                        if (s.volume > 0) {
                                            s.setVolume(s.volume - 25);
                                            window.setTimeout(s._fadeOut, 100);
                                        }
                                    };
                                    s._fadeOut();
                                    break;
                                case !s._spawned && !s._fadeOut && (perc > 85 || (s.position > 900 && s.duration < 3000)):
                                    s._spawned = true;
                                    cs = soundManager.createSound({
                                        "id": [sample.id, "crossfade", +new Date()].join('-'),
                                        "url": sample.url,
                                        "autoload": false,
                                    });
                                    cs.setVolume(0);
                                    cs.load({
                                        "onload": function () {
                                            play(subSampleId, cs);
                                        }
                                    });
                                    break;
                                }
                            }
                        },
                        "onfinish": loop && !crossfadingLoop ? function () { play(subSampleId); } : null
                    });
                    currentSample = s;
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

            this.setCrossfadingLoop = function(c) {
                crossfadingLoop = c;
            };
        };
        return AudioSample;
    }
);
