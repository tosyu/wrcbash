mamd.define("wrcb.core.Game",
    [
        "wrcb.core.utils"
    ],
    function (utils) {

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
            var scene,
                actors,
                actor = 0;

            if (+new Date() >= (lastFrameTimestamp + frameInterval)) {
                frame();
            }
            if (!!viewport
                && !!(scene = viewport.getScene())) {
                window.setTimeout(utils.bind(scene.tick, scene), 15);
                if (!!(actors = scene.getActors())) {
                    actor = actors.length;
                    while (--actor >= 0) {
                        window.setTimeout(utils.bind(actors[actor]._tick, actors[actor]), 15);
                    }
                }
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
                "wrcb.core.Viewport",
                "wrcb.scenes.Demo"
                ], function (
                    assets,
                    Viewport,
                    Demo) {
                viewport = new Viewport({
                    "width": 640,
                    "height": 480
                });
                start();

                assets.load(function () {
                    console.log("loaded all asssets");

                    var demo = new Demo();
                    viewport.addScene("demoscene", demo);

                }, function () {
                    console.log("failed to load assets");
                });
            })
        }
    };
});
