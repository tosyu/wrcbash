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
        frameStats = null,
        tickStats = null,
        draw = function (current) {
            if (drawing) {
                return false;
            }
            !!DEBUG && !!frameStats && frameStats.begin();
            drawing = true;
            var modifier = (current - lastFrame) / goldFrameTime;
            !!viewport && !!viewport.draw && viewport.draw(current, modifier);
            lastFrame = current;
            frames++;
            requestFrame(draw);
            drawing = false;
            !!DEBUG && !!frameStats && frameStats.end();
        },
        tick = function (current) {
            if (ticking) {
                return false;
            }
            !!DEBUG && !!tickStats && tickStats.begin();
            ticking = true;
            var modifier = (current - lastTick) / goldFrameTime;
            if (!!viewport
                && !!(scene = viewport.getScene())) {
                scene.tick(current, modifier);
                if (!!(actors = scene.getActors())) {
                    actor = actors.length;
                    while (--actor >= 0) {
                        actors[actor]._tick(current, modifier);
                    }
                }
            }

            lastTick = current;
            requestFrame(tick);
            ticking = false;
            !!DEBUG && !!tickStats && tickStats.end();
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
                "wrcb.scenes.Main"
                ], function (
                    assets,
                    Viewport,
                    Main) {
                viewport = new Viewport({
                    "width": 640,
                    "height": 480
                });
                if (DEBUG) {
                    frameStats = new window.Stats();
                    frameStats.setMode(0); // 0: fps, 1: ms

                    // Align top-left
                    frameStats.domElement.style.position = 'absolute';
                    frameStats.domElement.style.left = '0px';
                    frameStats.domElement.style.top = '0px';

                    document.body.appendChild(frameStats.domElement);

                    tickStats = new window.Stats();
                    tickStats.setMode(0); // 0: fps, 1: ms

                    // Align top-left
                    tickStats.domElement.style.position = 'absolute';
                    tickStats.domElement.style.right = '0px';
                    tickStats.domElement.style.top = '0px';

                    document.body.appendChild(tickStats.domElement);
                }
                start();
                viewport.addScene("main", new Main({
                    "viewport": viewport
                }));
            })
        }
    };
});
