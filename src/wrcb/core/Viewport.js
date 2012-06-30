mamd.define("wrcb.core.Viewport",
    [
        "wrcb.core.utils"
    ],
    function (utils) {
    return function (params) {
        var width = params.width || 320,
            height = params.height || 240,
            gameAspectRatio = width / height,
            screenAspectRatio = 0,
            canvasWidthStretch = 100,
            doubleBuffering = "doubleBuffering" in params
                ? params.doubleBuffering
                : true,
            currentScene = null,
            scenes = {},
            canvas = document.createElement("canvas");
            context = canvas.getContext("2d"),
            bufferContext = null,
            getContext = function () {
                return doubleBuffering ? bufferContext : context;
            },
            swapBuffers = function () {
                if (doubleBuffering) {
                    context.clearRect(0, 0, width, height);
                    context.drawImage(getContext().canvas, 0, 0);
                }
            },
            clear = function () {
                var ctx = getContext();
                ctx.save();
                ctx.clearRect(0, 0, width, height);
                ctx.restore();
            };

        screenAspectRatio = screen.availWidth / screen.availHeight;
        // fix game dimensions
        if (screenAspectRatio > gameAspectRatio) {
            canvasWidthStretch -= canvasWidthStretch * ((screen.availWidth - (screen.availHeight * gameAspectRatio)) / screen.availWidth)
        }

        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        canvas.setAttribute("style", ["width:", Math.round(canvasWidthStretch), "%;height:100%;min-height:100%;background:#000000;margin:0px auto;"].join(''));

        document.body.setAttribute("style", "width:100%;height:100%;min-height:100%;overflow:hidden;padding:0px;margin:0px;"); //@FIXME
        document.body.setAttribute("scrolling", "no");
        document.body.appendChild(canvas);

        if (doubleBuffering) {
            canvas = document.createElement("canvas");
            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);
            bufferContext = canvas.getContext("2d");
        }

        this.draw = function () {
            // clear the back buffer
            clear();

            // draw
            !!currentScene && !!scenes[currentScene] && scenes[currentScene].draw(getContext())

            // flip buffers
            swapBuffers();
        };

        this.addScene = function (sceneId, scene) {
            console.log("Viewport scene registration", sceneId);

            if (!sceneId || !scene) {
                throw "Scene not defined";
            }

            scenes[sceneId] = scene;

            if (!currentScene) {
                currentScene = sceneId;
            }
        };

        this.removeScene = function (sceneId) {
            console.log('Viewport scene unregistration', sceneId);

            if (!sceneId) {
                throw  'Scene not defined';
            }

            delete scenes[sceneId];
        };

        this.setScene = function (sceneId) {
            console.log('Select scene', sceneId);

            if (!scenes[sceneId]) {
                throw  'Scene does not exist!';
            }

            currentScene = sceneId;
        };

        this.getScene = function (sceneId) {
            return scenes[sceneId] || scenes[currentScene];
        };
    }
});
