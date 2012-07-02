mamd.define("wrcb.core.Scene",
    [
        "wrcb.core.utils",
        "wrcb.core.CollisionSystem"
    ], function (utils, CollisionSystem) {
    var Scene = function () {
        var layers = [0,1,2,3,4],
            actorsByLayer = {},
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

            actor._setLayer(layer);
            actors.push(actor);
            if (!actorsByLayer[layer]) {
                actorsByLayer[layer] = {};
            }
            actorsByLayer[layer][id] = utils.indexOf(actors, actor);
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

            var actor = actors[actorsByLayer[layer][id]];
            if (actor.isCollidable()) {
                collisions.unregisterActor(actor);
            }
            actor._forgetLayer();;
            actors.splice(actorsByLayer[layer][id], 1)
            delete actorsByLayer[layer][id];
        };

        this.getActorsByLayer = function (reversed) {
            return actors.slice().sort(function (actor1, actor2) {
                if (actor1._getLayer() < actor2._getLayer()) {
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

            return actorsByLayer[layer][id];
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
                _actors[actor]._draw(context);
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
