mamd.define("wrcb.core.Game",
    [
        "wrcb.core.utils"
    ],
    function (utils) {

    var goldFrameTime = 1000 / 60, // 60fps
        viewport,
        lastFrame = +new Date(),
        lastTick = +new Date();
        started = false,
        frames = 0,
        requestFrame = utils.getRequestFrameFunction(),
        draw = function (current) {
            var modifier = (current - lastFrame) / goldFrameTime;
            //window.document.title = (current - lastFrame) / frames * 1000;
            //console.log(current - started);
            !!viewport && !!viewport.draw && viewport.draw(current, modifier);
            lastFrame = current;
            frames++;
            requestFrame(draw);
        },
        tick = function (current) {
            var modifier = (current - lastTick) / goldFrameTime;
            if (!!viewport
                && !!(scene = viewport.getScene())) {
                scene.tick(current, modifier);
                //window.setTimeout(utils.bind(scene.tick, scene), 10);
                if (!!(actors = scene.getActors())) {
                    actor = actors.length;
                    while (--actor >= 0) {
                        actors[actor]._tick(current, modifier);
                        //window.setTimeout(utils.bind(actors[actor]._tick, actors[actor]), 10);
                    }
                }
            }

            lastTick = current;
            requestFrame(tick);
        },
        start = function () {
            if (!started) {
                DEBUG && console.log("starting");
                tick();
                draw();
                started = +new Date();
            }
        };

    return {
        "init": function () {
            window.DEBUG = !!document.body.getAttribute("debug")
                && document.body.getAttribute("debug") === "true";
            DEBUG && console.log("game initialized, loading files");
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
                    DEBUG && console.log("loaded all asssets");

                    var demo = new Demo();
                    viewport.addScene("demoscene", demo);

                }, function () {
                    DEBUG && console.log("failed to load assets");
                });
            })
        }
    };
});
