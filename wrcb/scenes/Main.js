mamd.define("wrcb.scenes.Main",
    [
        "wrcb.core.Scene",
        "wrcb.core.Camera",
        "wrcb.loader.Track"
    ],
    function (Scene, Camera, Track) {

    var Main = function (params) {
        this.constructor(params);
        var trackName = "RockyMountain";
        var t = Track.load(trackName, this.getViewport(), function () {
            console.log("loaded track", trackName);
            t.run();
        });
    };
    Main.prototype = new Scene();

    return Main;
});
