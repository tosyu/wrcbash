mamd.define("wrcb.Game", function () {
    var frameInterval = 1000 / 60,
        viewport,
        lastFrameTimestamp = +new Date(),
        started = false,
        timeoutId = null,
        frame = function () {
            lastFrameTimestamp = +new Date();
            !!viewport && viewport.draw();
        },
        loop = function () {
            if (+new Date() >= (lastFrameTimestamp + frameInterval)) {
                frame();
            }
            timeoutId = window.setTimeout(loop, 10);
        },
        start = function () {
            if (!started) {
                loop();
                console.log("starting");
                started = true;
            }
        }
        stop = function () {
            if (started) {
                window.clearTimeout(timeoutId);
            }
        };

    return {
        "init": function () {
            console.log("game initialized, loading files");
            mamd.require([
                "wrcb.loader.Assets",
                "wrcb.view.Viewport"
                ], function (
                    assets,
                    Viewport) {

                viewport = new Viewport({});
                start();

                /*assets.load(function () {
                    console.log("loaded all asssets");
                }, function () {
                    console.log("failed to load assets");
                });*/
            })
        }
    };
});
