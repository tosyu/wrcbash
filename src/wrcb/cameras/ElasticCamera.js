mamd.define(
    "wrcb.cameras.ElasticCamera",
    [
        "wrcb.core.Camera"
    ],
    function (Camera) {
        var ElasticCamera = function (params) {
            var actor = null,
                responseFactor = 0.09;

            this.constructor(params);

            this.watch = function (a) {
                !!DEBUG && console.log(this, "is watching", a);
                actor = a;
            };

            this.tick = function (timestamp, modifier) {
                if (actor) {
                    var p = actor.getPosition(),
                        cp = this.getPosition(),
                        d = actor.getDimensions(),
                        factor = responseFactor * modifier;
                    this.setPosition(cp[0] * (1 - factor) + (p[0] + d[0] / 2) * factor, cp[1] * (1 - factor) + (p[1] + d[1] / 2) * factor);
                }
            };
        };
        ElasticCamera.prototype = new Camera();
        return ElasticCamera;
    }
);
