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
            x = _x;
            y = _y;
        };

        this.getZoom = function () {
            return zoom;
        };

        this.setZoom = function (z) {
            zoom = z;
        };

        this._tick = function () {
            !!this.tick && this.tick();
        };
    };
    return Camera;
});
