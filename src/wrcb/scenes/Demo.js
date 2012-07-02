mamd.define("wrcb.scenes.Demo",
    [
        "wrcb.core.Scene",
        "wrcb.actors.Car",
        "wrcb.actors.Background",
        "wrcb.cameras.ElasticCamera"
    ],
    function (Scene, Car, Background, ElasticCamera) {

    var Demo = function () {
        var cam = new ElasticCamera();
        var car = new Car();
        var back = new Background();

        this.registerActor(
            Scene.consts.LAYER_BACKGROUND,
            "back",
            back
        );
        this.registerActor(
            Scene.consts.LAYER_MIDGROUND,
            "car",
            car
        );
        cam.watch(car);
        this.setCamera(cam);
    };
    Demo.prototype = new Scene();

    return Demo;
});
