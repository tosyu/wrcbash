mamd.define("wrcb.core.Viewport",
    [
        "wrcb.core.utils"
    ],
    function (utils) {
    return function (params) {
        var width = !!params && params.width || 320,
            height = !!params && params.height || 240,
            gameAspectRatio = width / height,
            screenAspectRatio = 0,
            canvasWidthStretch = 100,
            currentScene = null,
            scenes = {},
            canvas = document.createElement("canvas");
            context = canvas.getContext("2d"),
            bufferContext = null,
            _self = this,
            getContext = function () {
                return bufferContext;
            },
            swapBuffers = function () {
                context.clearRect(0, 0, width, height)
                context.drawImage(getContext().canvas, 0, 0);

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

        canvas = document.createElement("canvas");
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        bufferContext = canvas.getContext("2d");

        this.draw = function () {
            var scene = null,
                camera = null,
                zoom = 1,
                c = getContext();

            // clear the back buffer
            clear();

            if (!!(scene = _self.getScene())
                && !!(camera = scene.getCamera())) {
                cameraPosition = camera.getPosition();
                zoom = camera.getZoom();
                // draw
                c.save();
                c.translate(Math.round(width/2) - cameraPosition[0], Math.round(height/2) - cameraPosition[1]);
                c.scale(zoom, zoom);
                !!currentScene && !!scenes[currentScene] && scenes[currentScene].draw(c);
                c.restore();
            } else {
                // draw
                !!currentScene && !!scenes[currentScene] && scenes[currentScene].draw(c);
            }

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
