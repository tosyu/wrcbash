mamd.define("wrcb.Game", function () {
    return {
        "init": function () {
            console.log("game initialized, loading files");
            mamd.require(["wrcb.loader.Assets"], function (assets) {
                assets.load();
            })
        }
    };
});
