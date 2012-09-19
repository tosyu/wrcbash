mamd.define("wrcb.core.Camera", function () {
    var Camera = function (params) {
        var x = !!params && params.x || 0,
            y = !!params && params.y || 0,
            zoom = 1,
            context = null;

        this.getPosition = function () {
            return [x, y];
        };

        this.setPosition = function (_x, _y) {
            x = !!NO_FLOAT ? (0.5 + _x) | 0 : _x;
            y = !!NO_FLOAT ? (0.5 + _y) | 0 : _y;
        };

        this.getZoom = function () {
            return zoom;
        };

        this.setZoom = function (z) {
            zoom = !!NO_FLOAT ? (0.5 + z) | 0 : z;
        };

        this._tick = function (timestamp, modifier) {
            !!this.tick && this.tick(timestamp, modifier);
        };
    };
    return Camera;
});
