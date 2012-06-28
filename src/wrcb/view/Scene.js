mamd.define("wrcb.view.Scene", ["wrcb.utils"], function (utils) {
    return function () {
        var layers = [0,1,2,3,4],
            actorLayers = {},
            actors = [];

        this.consts = {
            "LAYER_BACKGROUND_FAR": 0,
            "LAYER_BACKGROUND": 1,
            "LAYER_MIDGROUND": 2,
            "LAYER_FOREGROUND": 3,
            "LAYER_FOREGROUND_CLOSE": 4
        };

        this.registerActor = function (layer, id, actor) {

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
            actorLayers[layer][id] = utils.indexOf(actors, actor);

            //@TODO COLLISIONS
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

            delete actorLayers[layer][id]._sceneLayer;
            actors.splice(actorLayers[layer][id], 1)
            delete actorLayers[layer][id];

            //@TODO COLLISIONS
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

        this.getActors = function () {
            return actors;
        };

        this.draw = function (context) {
            var _actors = this.getActorsByLayer(true),
                actor = _actors.length;
            while (--actor >= 0) {
                context.save();
                actors[actor].draw(context);
                context.restore();
            }
        };
    };
});
