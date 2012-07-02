mamd.define("wrcb.core.Force", ["wrcb.core.utils"], function (utils) {
    return function () {
        var bound = [],
            type = null;

        this.setType = function (t) {
            type = t;
        };

        this.getType = function () {
            return type;
        };

        this._tick = function () {
            !!this.tick && this.tick();
        };

        this.bind = function (actor) {
            DEBUG && console.log(actor.getId(), "affected by force", type);
            if (utils.indexOf(bound, actor) === -1) {
                bound.push(actor);
            }
        };

        this.unbind = function (actor) {
            var index;
            if ((index = utils.indexOf(bound, actor)) !== -1) {
                bound.splice(index, 1);
            }
            DEBUG && console.log(type, "stops affecting:", actor.getId());
        };

        this.getBound = function () {
            return bound;
        };
    };
});
