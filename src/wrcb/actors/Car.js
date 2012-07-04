mamd.define(
    "wrcb.actors.Car",
    [
        "wrcb.core.utils",
        "wrcb.loader.Assets",
        "wrcb.core.Actor",
        "wrcb.core.AudioSample",
        "wrcb.forces.UserInput",
        "wrcb.forces.Inertia"
    ],
    function (utils, assets, Actor, AudioSample, UserInput, Inertia) {

        var Car = function (params) {
            this.constructor(params);

            var carSprite = assets.get("assets/images/car_white_red_stripes.png"),
                engineSound = new AudioSample(assets.get("assets/effects/engine.mp3"));

            this.addForce(new UserInput);
            this.addForce(new Inertia);

            this.draw = function (context) {
                var p = this.getPosition(),
                    d = this.getDimensions(),
                    r = this.getRotation(),
                    center = [d[0] / 2, d[1] / 2];

                context.translate(p[0] + center[0], p[1] + center[1]);
                context.rotate((r+90) * Math.PI / 180);

                context.translate(-center[0], -center[1]);

                context.drawImage(carSprite, 0, 0, d[0], d[1]);
            };


            this.tick = function () {
                if (engineSound.isPlaying() === false) {
                    engineSound.play();
                }
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

        Car.prototype = new Actor();

        return Car;
    }
);
