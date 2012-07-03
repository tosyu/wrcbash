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
        drawing = false,
        ticking = false,
        frames = 0,
        requestFrame = utils.getRequestFrameFunction(),
        draw = function (current) {
            if (drawing) {
                return false;
            }
            drawing = true;
            var modifier = (current - lastFrame) / goldFrameTime;
            !!viewport && !!viewport.draw && viewport.draw(current, modifier);
            lastFrame = current;
            frames++;
            requestFrame(draw);
            drawing = false;
        },
        tick = function (current) {
            if (ticking) {
                return false;
            }
            ticking = true;
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
            ticking = false;
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
