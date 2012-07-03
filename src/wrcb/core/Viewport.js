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
            canvasInterpolation = !!params && "canvasInterpolation" in params
                ? params.canvasInterpolation
                : true,
            bufferContext = null
            _self = this;

        screenAspectRatio = screen.availWidth / screen.availHeight;
        // fix game dimensions
        if (screenAspectRatio > gameAspectRatio) {
            canvasWidthStretch -= canvasWidthStretch * ((screen.availWidth - (screen.availHeight * gameAspectRatio)) / screen.availWidth)
        }

        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        canvas.setAttribute("style", ["width:", Math.round(canvasWidthStretch), "%;height:100%;min-height:100%;background:#000000;margin:0px auto;"].join(''));

        document.body.appendChild(canvas);

        canvas = document.createElement("canvas");
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        bufferContext = canvas.getContext("2d");

        if (!canvasInterpolation && "mozImageSmoothingEnabled" in context) {
            context.mozImageSmoothingEnabled = false;
        }
        if (!canvasInterpolation && "mozImageSmoothingEnabled" in bufferContext) {
            bufferContext.mozImageSmoothingEnabled = false;
        }

        this.draw = function (timestamp, modifier) {
            var scene = null,
                camera = null,
                zoom = 1;

            drawing = true;
            if (!!(scene = _self.getScene())
                && !!(camera = scene.getCamera())) {
                cameraPosition = camera.getPosition();
                zoom = camera.getZoom();
                // draw
                bufferContext.save();
                bufferContext.translate(Math.round(width/2) - cameraPosition[0], Math.round(height/2) - cameraPosition[1]);
                bufferContext.scale(zoom, zoom);
                !!currentScene && !!scenes[currentScene] && scenes[currentScene].draw(bufferContext, timestamp, modifier);
                bufferContext.restore();
            } else {
                // draw
                !!currentScene && !!scenes[currentScene] && scenes[currentScene].draw(bufferContext, timestamp, modifier);
            }

            context.drawImage(bufferContext.canvas, 0, 0);
        };

        this.addScene = function (sceneId, scene) {
            DEBUG && console.log("Viewport scene registration", sceneId);

            if (!sceneId || !scene) {
                throw "Scene not defined";
            }

            scenes[sceneId] = scene;

            if (!currentScene) {
                currentScene = sceneId;
            }
        };

        this.removeScene = function (sceneId) {
            DEBUG && console.log('Viewport scene unregistration', sceneId);

            if (!sceneId) {
                throw  'Scene not defined';
            }

            delete scenes[sceneId];
        };

        this.setScene = function (sceneId) {
            DEBUG && console.log('Select scene', sceneId);

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
