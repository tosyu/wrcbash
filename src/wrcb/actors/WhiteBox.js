mamd.define(
    "wrcb.actors.WhiteBox",
    [
        "wrcb.core.utils",
        "wrcb.core.Actor"
    ],
    function (utils, Actor) {
        var WhiteBox = function () {

            this.draw = function (context) {
                var p = this.getPosition(),
                    d = this.getDimensions();
                context.translate(p[0], p[1]);
                context.fillStyle = utils.getColor(255,255,255);
                context.fillRect(0, 0, d[0], d[1]);
            };

            this.cornerCollisionWith = function (corner, actor) {
                v = actor.getVelocity();
                if (Math.abs(v) > 0.8) {
                    actor.setVelocity(v > 0 ? 0.8 : -0.8);
                }
            };
            this.edgeCollisionWith = function (edge, actor) {
                v = actor.getVelocity();
                if (Math.abs(v) > 0.8) {
                    actor.setVelocity(v > 0 ? 0.8 : -0.8);
                }
            };
            this.pointCollisionWith = function (point, actor) {
                v = actor.getVelocity();
                if (Math.abs(v) > 0.8) {
                    actor.setVelocity(v > 0 ? 0.8 : -0.8);
                }
            };
        };
        WhiteBox.prototype = new Actor({
            "x": 200,
            "y": 200,
            "width": 100,
            "height": 100,
            "drawable": true,
            "collidable": true,
            /*"collider": true,*/
            "id": "whitebox"
        })
        return WhiteBox;
    }
);
