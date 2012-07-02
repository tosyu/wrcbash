mamd.define(
    "wrcb.actors.Car",
    [
        "wrcb.core.utils",
        "wrcb.loader.Assets",
        "wrcb.core.Actor",
        "wrcb.forces.UserInput",
        "wrcb.forces.Inertia"
    ],
    function (utils, assets, Actor, UserInput, Inertia) {

        var Car = function () {
            var carSprite = assets.get("assets/images/car_white_red_stripes.png");

            this.addForce(new UserInput);
            this.addForce(new Inertia);

            this.draw = function (context) {
                var p = this.getPosition(),
                    d = this.getDimensions(),
                    r = this.getRotation(),
                    center = [Math.round(d[0] / 2), Math.round(d[1] / 2)];

                context.translate(p[0] + center[0], p[1] + center[1]);
                context.rotate((r+90) * Math.PI / 180);

                context.translate(-center[0], -center[1]);

                context.drawImage(carSprite, 0, 0, d[0], d[1]);
            };

            this.cornerCollisionWith = function (corner, actor) {
                console.log(this.getId(), "corner collision!", corner, actor.getId())
            };
            this.edgeCollisionWith = function (edge, actor) {
                console.log(this.getId(), "edge collision", edge, actor.getId())
            };
            this.pointCollisionWith = function (point, actor) {
                console.log(this.getId(), "point collision", point, actor.getId())
            };
        };

        Car.prototype = new Actor({
            "x": -32, // start at center
            "y": -32, // start at center
            "width": 64,
            "height": 64,
            "drawable": true,
            "collidable": true,
            "collider": true,
            "id": "playerCar"
        });

        return Car;
    }
);
