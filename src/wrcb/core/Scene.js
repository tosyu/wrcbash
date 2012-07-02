mamd.define("wrcb.core.Scene",
    [
        "wrcb.core.utils",
        "wrcb.core.CollisionSystem"
    ], function (utils, CollisionSystem) {
    var Scene = function () {
        var layers = [0,1,2,3,4],
            actorLayers = {},
            actors = [],
            collisions = new CollisionSystem();

        this.registerActor = function (layer, id, actor, CollisionSystem) {

            switch (true) {
            case !layer:
                throw "Layer not defined";
                break;
            case !layers[layer]:
                throw "Layer does not exist";
                break;
            case !id:
                throw "Actor unique id not specifed";
                break;
            case !actor:
                throw "Actor not defined";
                break;
            case !!layers[layer][id]:
                throw "Actor already exists in scene layer";
                break;
            }

            actors._sceneLayer = layer;
            actors.push(actor);
            if (!actorLayers[layer]) {
                actorLayers[layer] = {};
            }
            actorLayers[layer][id] = utils.indexOf(actors, actor);
            if (actor.isCollidable()) {
                collisions.registerActor(actor);
            }
        };

        this.unregisterActor = function (layer, id) {

            switch (true) {
            case !layer:
                throw "Layer not defined";
                break;
            case !layers[layer]:
                throw "Layer does not exist";
                break;
            case !id:
                throw "Actor unique id not specifed";
                break;
            case !layers[layer][id]:
                throw "Actor already does not exists in scene layer";
                break;
            }

            if (actor.isCollidable()) {
                collisions.unregisterActor(actor);
            }
            delete actorLayers[layer][id]._sceneLayer;
            actors.splice(actorLayers[layer][id], 1)
            delete actorLayers[layer][id];
        };

        this.getActorsByLayer = function (reversed) {
            return actors.sort(function (actor1, actor2) {
                if (actor1._sceneLayer < actor2._sceneLayer) {
                    return reversed ? 1 : -1;
                } else if (actor1._sceneLayer > actor2._sceneLayer) {
                    return reversed ? -1 : 1;
                }
                return 0;
            });
        };

        this.getActorsGroupedByLayer = function () {
            var i = 0,
                l = layers.length,
                result = [],
                actor;
            for(; i < l; i++) {
                if (!result[i]) {
                    result[i] = [];
                }
                for(actor in layers[i]) {
                    if (layers[i].hasOwnProperty(actor)) {
                        result.ish(layers[i][actor]);
                    }
                }
            }

            return result;
        };

        this.getActor = function () {
            switch (true) {
            case !layer:
                throw "Layer not defined";
                break;
            case !layers[layer]:
                throw "Layer does not exist";
                break;
            case !id:
                throw "Actor unique id not specifed";
                break;
            case !layers[layer][id]:
                throw "Actor already does not exists in scene layer";
                break;
            }

            return actorLayers[layer][id];
        };

        this.setCamera = function (c) {
            camera = c;
        };

        this.getCamera = function () {
            return camera;
        };

        this.getActors = function () {
            return actors;
        };

        this.draw = function (context) {
            var _actors = this.getActorsByLayer(true),
                actor = _actors.length;
            while (--actor >= 0) {
                context.save();
                actors[actor]._draw(context);
                context.restore();
            }
        };

        this.tick = function (timestamp) {
            collisions.tick();
            camera._tick();
        };
    };

    Scene.consts = {
        "LAYER_BACKGROUND_FAR": 0,
        "LAYER_BACKGROUND": 1,
        "LAYER_MIDGROUND": 2,
        "LAYER_FOREGROUND": 3,
        "LAYER_FOREGROUND_CLOSE": 4
    };

    return Scene;
});
