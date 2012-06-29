mamd.define(
    "wrcb.forces.UserInput",
    [
        "wrcb.utils"
    ],
    function (utils) {
        var affectedActor = false,
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
                    if (v >= -2) {
                        v -= 0.3;
                    }
                    affectedActor.setVelocity(v);
                } else {
                    if (v <= 5) {
                        v += 0.3;
                    }
                    affectedActor.setVelocity(v);
                }
                affectedActor.setPosition(p[0] + m[0], p[1] + m[1]);
            },
            horizontalMove = function (negative) {
                var r = affectedActor.getRotation();
                if (negative) {
                    affectedActor.setRotation(r-1);
                } else {
                    affectedActor.setRotation(r+1);
                }
            },
            handleKeyDown = function (evt) {
                if (!!affectedActor) {
                    var key = event.keyCode || event.which;
                    switch (key) {
                    case 38:
                        verticalMove();
                        break;
                    case 40:
                        verticalMove(true);
                        break;
                    case 39:
                        horizontalMove();
                        break;
                    case 37:
                        horizontalMove(true);
                        break;
                    }
                }
            };

        utils.bindEvent(document, "keydown", handleKeyDown);

        return {
            "affects": function (actor) {
                affectedActor = actor;
            }
        };
});
