mamd.define("wrcb.loader.Track",
    [
        "wrcb.core.Request",
        "wrcb.core.utils",
        "wrcb.loader.Assets",
        "wrcb.core.Scene"
    ], function (request, utils, assets, Scene) {
    var Track = function (url, v, callback) {
        !!DEBUG && console.log("loading track", url);
        var scene = null,
            id = null,
            viewport = v,
            rs = request.create({
                "url": url
            }).on("success", function (_raw) {
                var data = utils.decodeJson(_raw);
                id = data.id;
                !!DEBUG && console.log("loaded track", url, data.id)
                assets.load(data.assets, function () {
                    !!DEBUG && console.log("loaded all track assets", url, "now loading camera");
                    scene = new Scene();
                    mamd.require([data.camera], function (Camera) {
                        var cam = new Camera(),
                            objs = [],
                            x = 0,
                            i = data.actors.length;
                        !!DEBUG && console.log("loaded camera", data.camera, "now loading actors");
                        scene.setCamera(cam);
                        while (--i >= 0) {
                            objs.push(data.actors[i].instance);
                        }
                        mamd.require(objs, function () {
                            var instances = Array.prototype.slice.call(arguments).reverse(),
                                instance = instances.length,
                                tempInstance = null,
                                actorId = null;
                            while (--instance >= 0) {
                                data.actors[instance].params.id = ["actor", +new Date(), Math.floor((Math.random()+1)*100)].join("_");
                                tempInstance = new instances[instance](data.actors[instance].params);
                                if (data.actors[instance].watched === true) {
                                    cam.watch(tempInstance);
                                }
                                scene.registerActor(Scene.consts[data.actors[instance].layer], tempInstance.getId(), tempInstance);
                            }
                            viewport.addScene(id, scene);
                            !!callback && typeof callback === "function" && callback();
                        });
                    });
                }, function () {
                    !!DEBUG && console.error("could not load track assets", url);
                });
            }).on("error", function () {
                !!DEBUG && console.error("could not track", url);
            });
        rs.send();
        this.run = function () {
            viewport.setScene(id);
        };
    };
    return {
        "load": function (track, v, onLoadCallback) {
            var url = ["assets/tracks", track, "track.json"].join('/');
            return new Track(url, v, onLoadCallback);
        }
    }
});
