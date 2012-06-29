mamd.define(
    "wrcb.forces.Inertia",
    [
        "wrcb.forces.Force",
        "wrcb.utils"
    ],
    function (Force, utils) {
        Inertia = function () {
            var move = function (actor, negative) {
                var p = actor.getPosition(),
                    r = actor.getRotation(),
                    radians = r * Math.PI / 180,
                    v = actor.getVelocity(),
                    m = [
                        Math.cos(radians) * v,
                        Math.sin(radians) * v
                    ];
                if (negative) {
                    v += 0.1;
                    if (v > -0.1) {
                        v = 0;
                    }
                    actor.setVelocity(v);
                } else {
                    v -= 0.1;
                    if (v < 0.1) {
                        v = 0;
                    }
                    actor.setVelocity(v);
                }
                actor.setPosition(p[0] + m[0], p[1] + m[1]);
            };

            this.tick = function () {
                var actors = this.getBound(),
                    actor = 0;

                while (--actor >= 0) {
                    move(actor[i], actor[i].getVelocity() < 0);
                }
            };
        };

        Inertia.prototype = new Force();
        return Inertia;
});
