mamd.define("wrcb.view.Viewport",
    [
        "wrcb.utils"
    ],
    function (utils) {
    return function (params) {
        var width = params.width || 320,
            height = params.height || 240,
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

        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        canvas.setAttribute("style", "width:100%;height:100%;position:absolute;top:0;left:0;background:#000000;");

        document.body.setAttribute("style", "width:100%;height:640px"); //@FIXME
        document.body.appendChild(canvas);


        if (doubleBuffering) {
            canvas = document.createElement("canvas");
            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);
            bufferContext = canvas.getContext("2d");
        }

        this.draw = function () {
            /*if (typeof this.currentScene === "undefined") {
                throw new Error("No scene selected!");
            }*/
            // clear the back buffer
            clear();
            // draw
            //var ctx = this.getContext();
            //this.scenes[this.currentScene]._draw(ctx);
            getContext().fillStyle = utils.getColor(100, 100, 100); //@TODO remove
            getContext().fillRect (10, 10, 55 + Math.round(Math.random(100)), 50); //@TODO remove

            // flip buffers
            swapBuffers();
        };

        this.addScene = function (sceneId, scene) {
            console.log("Viewport scene registration", sceneId);

            if (!sceneId || !scene) {
                throw new "Scene not defined";
            }

            scenes[sceneId] = scene;

            if (!currentScene) {
                currentScene = sceneId;
            }
        };

        this.removeScene = function (sceneId) {
            console.log('Viewport scene unregistration', sceneId);

            if (!sceneId) {
                throw new 'Scene not defined';
            }

            delete scenes[sceneId];
        };

        this.setScene = function (sceneId) {
            console.log('Select scene', sceneId);

            if (!scenes[sceneId]) {
                throw new 'Scene does not exist!';
            }

            currentScene = sceneId;
        };

        this.getScene = function (sceneId) {
            return scenes[sceneId] || scenes[currentScene];
        };
    }
});
