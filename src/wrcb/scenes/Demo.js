mamd.define("wrcb.scenes.Demo",
    [
        "wrcb.core.Scene",
        "wrcb.actors.Car",
        "wrcb.actors.WhiteBox",
        "wrcb.cameras.ElasticCamera"
    ],
    function (Scene, Car, WhiteBox, ElasticCamera) {

    var Demo = function () {
        var cam = new ElasticCamera();
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
        cam.watch(car);
        this.setCamera(cam);
    };
    Demo.prototype = new Scene();

    return Demo;
});
