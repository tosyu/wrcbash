mamd.define(
    "wrcb.actors.Car",
    [
        "wrcb.utils",
        "wrcb.loader.Assets",
        "wrcb.actors.Actor",
        "wrcb.forces.UserInput",
        "wrcb.forces.Inertia"
    ],
    function (utils, assets, Actor, userInput, inertia) {

    var Car = function () {
        var carSprite = assets.get("assets/images/car_white_red_stripes.png");

        this.addForce(userInput);
        this.addForce(inertia);

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
    };

    Car.prototype = new Actor({
        "x": 10,
        "y": 10,
        "width": 64,
        "height": 64,
        "drawable": true
    });

    return Car;
});
