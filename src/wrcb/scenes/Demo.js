mamd.define("wrcb.scenes.Demo",
    [
        "wrcb.view.Scene",
        "wrcb.actors.Car"
    ],
    function (Scene, Car) {

    var Demo = function () {
        var car = new Car();
        this.registerActor(
            Scene.consts.LAYER_MIDGROUND,
            "car",
            car
        );
    };
    Demo.prototype = new Scene();

    return Demo;
});
