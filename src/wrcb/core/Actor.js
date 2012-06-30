mamd.define("wrcb.core.Actor", ["wrcb.core.utils"], function (utils) {
    return function (params) {
        var id = params.id || null,
            x = params.x || 0,
            y = params.y || 0,
            velocity = params.velocity || 0,
            width = params.width || 0,
            height = params.height || 0,
            rotation = params.rotation || 0,
            forces = [],
            collidable = "collidable" in params
                ? params.collidable
                : false,
            collider = "collider" in params
                ? params.collider
                : false,
            collidesWithScreen = "collidesWithScreen" in params
                ? params.collidesWithScreen
                : false,
            drawable = "drawable" in params
                ? params.drawable
                : false;

        this.seteId = function (_id) {
            //!!(typeof _id !== "string") && throw "Actor id must be string";
            id = _id;
        };

        this.getId = function () {
            return id;
        };

        this._draw = function (context) {
            var edges = this.getEdges(),
                edge = edges.length;
            if (DEBUG) {
                context.save();
                context.strokeStyle = utils.getColor(
                    Math.floor((Math.random()*255)+1),
                    Math.floor((Math.random()*255)+1),
                    Math.floor((Math.random()*255)+1));
                context.beginPath();
                context.moveTo(edges[edge - 1][0][0], edges[edge - 1][0][1]);
                while (--edge >= 0) {
                    context.lineTo(edges[edge][0][0], edges[edge][0][1]);
                }
                context.closePath();
                context.stroke();
            }

            context.restore();
            !!drawable && !!this.draw && this.draw(context);
        };

        this._tick = function (timestamp) {
            var force = forces.length;
            while (--force >= 0) {
                !!forces[force].tick
                    && window.setTimeout(utils.bind(forces[force].tick, forces[force], timestamp), 15);

            }
            !!this.tick && window.setTimeout(utils.bind(this.tick, this, timestamp), 15);
        };

        this.setVelocity = function (v) {
            velocity = v
        };

        this.getVelocity = function () {
            return velocity;
        };

        this.setPosition = function (_x, _y) {
            x = _x;
            y = _y;
        };

        this.getPosition = function () {
            return [x, y];
        };

        this.setDimensions = function (w, h) {
            width = w;
            height = h;
        };

        this.getDimensions = function () {
            return [width, height];
        };

        this.setRotation = function (r) {
            rotation = r;
        };

        this.getRotation = function () {
            return rotation;
        };

        this.isCollidable = function () {
            return collidable;
        };

        this.isCollider = function () {
            return collider;
        };

        this.canCollideWithScreen = function () {
            return collidesWithScreen;
        };

        this.getBoundingBox = function () {
            return [
                [x, y],
                [x + width, y],
                [x + width, y + height],
                [x, y + height]
            ];
        };

        this.getCoordinates = function () {
            return this.getBoundingBox();
        };

        this.getEdges = function () {
            var coords = this.getCoordinates(),
                edges = [],
                i = 0,
                imax = coords.length,
                iNext;
                for (; i < imax; i++) {
                    iNext = i >= imax - 1 ? 0 : 1;
                    edges.push([coords[i], coords[iNext]]);
                }
            return edges;
        };

        this.addForce = function (force) {
            if (utils.indexOf(forces, force) === -1) {
                force.bind(this);
                forces.push(force);
            }
        };

        this.removeForce = function (force) {
            var index;
            if ((index = utils.indexOf(forces, force)) !== -1) {
                forces[index].unbind(this);
                forces.splice(index, 1);
            }
        };

        this.getForces = function () {
            return forces;
        };

        this.cornerCollisionWith = function (corner, actor) {};
        this.edgeCollisionWith = function (edge, actor) {};
        this.pointCollisionWith = function (point, actor) {};
    }
});
