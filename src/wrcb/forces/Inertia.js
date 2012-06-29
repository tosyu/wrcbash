mamd.define(
    "wrcb.forces.Inertia",
    [
        "wrcb.utils"
    ],
    function (utils) {
        var affectedActor = false,
            isApplying = false,
            verticalMove = function (negative) {
                var p = affectedActor.getPosition(),
                    r = affectedActor.getRotation(),
                    radians = r * Math.PI / 180,
                    v = affectedActor.getVelocity(),
                    m = [
                        Math.cos(radians) * v,
                        Math.sin(radians) * v
                    ];
                if (negative) {
                    v += 0.1;
                    if (v > -0.1) {
                        v = 0;
                    }
                    affectedActor.setVelocity(v);
                } else {
                    v -= 0.1;
                    if (v < 0.1) {
                        v = 0;
                    }
                    affectedActor.setVelocity(v);
                }
                affectedActor.setPosition(p[0] + m[0], p[1] + m[1]);
            };

        return {
            "affects": function (actor) {
                affectedActor = actor;
            },

            "isApplying": function () {
                return isApplying;
            },

            "tick": function () {
                var forces = affectedActor.getForcesApplying(),
                    v = affectedActor.getVelocity();
                if (v !== 0) {
                    isApplying = true;
                    verticalMove(v < 0);
                } else {
                    isApplying = false;
                }
            }
        };
});
