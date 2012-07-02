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
                actor = a;
            };

            this.tick = function () {
                if (actor) {
                    var p = actor.getPosition(),
                        cp = this.getPosition(),
                        d = actor.getDimensions();
                    this.setPosition(
                        cp[0] * (1 - responseFactor) + (p[0] + d[0] / 2) * responseFactor,
                        cp[1] * (1 - responseFactor) + (p[1] + d[1] / 2) * responseFactor);
                }
            };
        };
        ElasticCamera.prototype = new Camera();
        return ElasticCamera;
    }
);
