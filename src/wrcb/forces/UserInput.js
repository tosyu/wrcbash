mamd.define(
    "wrcb.forces.UserInput",
    [
        "wrcb.utils"
    ],
    function (utils) {
        var affectedActor = false,
            keys = [],
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
                    if (v >= 0) {
                        v = 0;
                    }
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
                var r = affectedActor.getRotation(),
                    v = affectedActor.getVelocity();
                if (Math.abs(v) > 0) {
                    if (negative) {
                        affectedActor.setRotation(r-1);
                    } else {
                        affectedActor.setRotation(r+1);
                    }
                }
            },
            handleKeyUp = function (evt) {
                if (!!affectedActor) {
                    var key = event.keyCode || event.which,
                        index;
                    if ((index = utils.indexOf(keys, key)) !== -1 && !!key) {
                        keys.splice(index, 1);
                    }
                }
            },
            handleKeyDown = function (evt) {
                if (!!affectedActor) {
                    var key = event.keyCode || event.which;
                    if (utils.indexOf(keys, key) === -1 && !!key) {
                        keys.push(key);
                    }
                }
            };

        utils.bindEvent(document, "keydown", handleKeyDown);
        utils.bindEvent(document, "keyup", handleKeyUp);

        return {
            "affects": function (actor) {
                affectedActor = actor;
            },

            "isApplying": function () {
                return isApplying;
            },

            "tick": function () {
                var key = keys.length;
                isApplying = key > 0;

                while (--key >= 0) {
                    switch (keys[key]) {
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
            }
        };
});
