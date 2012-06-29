mamd.define(
    "wrcb.forces.Inertia",
    [
        "wrcb.core.Force",
        "wrcb.core.utils"
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
                    v += 0.08;
                    if (v > -0.1) {
                        v = 0;
                    }
                    actor.setVelocity(v);
                } else {
                    v -= 0.025;
                    if (v < 0.1) {
                        v = 0;
                    }
                    actor.setVelocity(v);
                }
                actor.setPosition(p[0] + m[0], p[1] + m[1]);
            };

            this.setType("Inertia");

            this.tick = function () {
                var actors = this.getBound(),
                    actor = actors.length;

                while (--actor >= 0) {
                    move(actors[actor], actors[actor].getVelocity() < 0);
                }
            };
        };

        Inertia.prototype = new Force();
        return Inertia;
});
