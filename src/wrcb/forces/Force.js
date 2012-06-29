mamd.define("wrcb.forces.Force", ["wrcb.utils"], function (utils) {
    return function () {
        var bound = [];

        this._tick = function () {
            !!this.tick && this.tick();
        };

        this.bind = function (actor) {
            if (utils.indexOf(bound, actor) === -1) {
                bound.push(actor);
            }
        };

        this.unbind = function (actor) {
            var index;
            if ((index = utils.indexOf(bound, actor)) !== -1) {
                bound.splice(index, 1);
            }
        };

        this.getBound = function () {
            return bound;
        };
    };
});
