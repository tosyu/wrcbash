mamd.define("wrcb.scenes.Demo",
    [
        "wrcb.core.Scene",
        "wrcb.actors.Car",
        "wrcb.actors.WhiteBox"
    ],
    function (Scene, Car, WhiteBox) {

    var Demo = function () {
        var car = new Car();
        var box = new WhiteBox();

        this.registerActor(
            Scene.consts.LAYER_MIDGROUND,
            "car",
            car
        );
        this.registerActor(
            Scene.consts.LAYER_MIDGROUND,
            "box",
            box
        );
    };
    Demo.prototype = new Scene();

    return Demo;
});
