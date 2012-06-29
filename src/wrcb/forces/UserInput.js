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
                            v -= 0.3;
                        }
                        actor.setVelocity(v);
                    } else {
                        if (v <= 5) {
                            v += 0.3;
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
                            actor.setRotation(r-1);
                        } else {
                            actor.setRotation(r+1);
                        }
                    }
                },
                handleKeyUp = function (evt) {
                    var key = event.keyCode || event.which,
                        index;
                    if ((index = utils.indexOf(keys, key)) !== -1 && !!key) {
                        keys.splice(index, 1);
                    }
                },
                handleKeyDown = function (evt) {
                    var key = event.keyCode || event.which;
                    if (utils.indexOf(keys, key) === -1 && !!key) {
                        keys.push(key);
                    }
                };

            utils.bindEvent(document, "keydown", handleKeyDown);
            utils.bindEvent(document, "keyup", handleKeyUp);

            this.tick = function () {
                var key = keys.length,
                    actors = this.getBound(),
                    actor = actors.length;

                while (--key >= 0) {
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
