mamd.define(
    "wrcb.forces.UserInput",
    [
        "wrcb.forces.Force",
        "wrcb.utils"
    ],
    function (Force, utils) {

        var UserInput = function () {
            var keys = [],
                move = function (actor, negative) {
                    var p = actor.getPosition(),
                        r = actor.getRotation(),
                        radians = r * Math.PI / 180,
                        v = actor.getVelocity(),
                        m = [
                            Math.cos(radians) * v,
                            Math.sin(radians) * v
                        ];
                    if (negative) {
                        if (v >= 0) {
                            v = 0;
                        }
                        if (v >= -2) {
                            v -= 0.2;
                        }
                        actor.setVelocity(v);
                    } else {
                        if (v <= 3) {
                            v += 0.2;
                        }
                        actor.setVelocity(v);
                    }
                    actor.setPosition(p[0] + m[0], p[1] + m[1]);
                },
                turn = function (actor, negative) {
                    var r = actor.getRotation(),
                        v = actor.getVelocity();
                    if (Math.abs(v) > 0) {
                        if (negative) {
                            actor.setRotation(r-1.7);
                        } else {
                            actor.setRotation(r+1.7);
                        }
                    }
                };

            utils.bindEvent(document, "keyup", function (evt) {
                var key = event.keyCode || event.which,
                    index;
                if ((index = utils.indexOf(keys, key)) !== -1 && !!key) {
                    keys.splice(index, 1);
                }
            });
            utils.bindEvent(document, "keydown", function (evt) {
                var key = event.keyCode || event.which;
                if (utils.indexOf(keys, key) === -1 && !!key) {
                    keys.push(key);
                }
            });

            this.tick = function () {
                var key = keys.length,
                    actors = this.getBound(),
                    actor = 0;

                while (--key >= 0) {
                    actor = actors.length
                    while (--actor >= 0) {
                        switch (keys[key]) {
                        case 38:
                            move(actors[actor]);
                            break;
                        case 40:
                            move(actors[actor], true);
                            break;
                        case 39:
                            turn(actors[actor]);
                            break;
                        case 37:
                            turn(actors[actor], true);
                            break;
                        }
                    }
                }
            };
        };
        UserInput.prototype = new Force();

        return UserInput;
});
