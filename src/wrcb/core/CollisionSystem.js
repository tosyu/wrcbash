mamd.define("wrcb.core.CollisionSystem", function () {
    return function () {
        var colliders = [],
            actors = [],
            boxOverlapsWith = function (box1, box2) {
                var i = 0,
                    imax = box1.length;
                for (; i < imax; i++) {
                    if (Math.min(box2[0][0], box2[1][0]) <= box1[i][0] && box1[i][0] <= Math.max(box2[0][0], box2[1][0])
                     && Math.min(box2[1][1], box2[2][1]) <= box1[i][1] && box1[i][1] <= Math.max(box2[1][1], box2[2][1])) { // since it"s a rectangle we dont need to test all coords
                         return i;
                     }
                }
                return false;
            },
            rotateEdges = function (edges, rotation) {
                if (rotation === 0) {
                    return edges;
                }
                var radius = Math.max(edges[0][1][0], edges[1][0][0]) - Math.min(edges[0][1][0], edges[1][0][0]),
                    i = 0,
                    l = edges.length,
                    xOffset = edges[0][0][0],
                    yOffset = edges[0][0][1];
                for (; i < l; i++) {
                    // origin of rotation should bee 0,0 of the object nt grid
                    edges[i][0][0] -= xOffset;
                    edges[i][0][1] -= yOffset;
                    edges[i][1][0] -= xOffset;
                    edges[i][1][1] -= yOffset;

                    // rotate
                    edges[i][0][0] = parseInt(Math.cos(radius) * edges[i][0][0] - Math.sin(radius) * edges[i][0][1]);
                    edges[i][0][1] = parseInt(Math.sin(radius) * edges[i][0][0] + Math.cos(radius) * edges[i][0][1]);
                    edges[i][1][0] = parseInt(Math.cos(radius) * edges[i][1][0] - Math.sin(radius) * edges[i][1][1]);
                    edges[i][1][1] = parseInt(Math.sin(radius) * edges[i][1][0] + Math.cos(radius) * edges[i][1][1]);

                    // end add offset back
                    edges[i][0][0] += xOffset;
                    edges[i][0][1] += yOffset;
                    edges[i][1][0] += xOffset;
                    edges[i][1][1] += yOffset;
                }
                return edges;
            },
            getBoundingBoxFromEdgeCorners = function (edge) {
                var a = Math.max(edge[0][0], edge[1][0]) - Math.min(edge[0][0], edge[1][0]),
                    b = Math.max(edge[0][1], edge[1][1]) - Math.min(edge[0][1], edge[1][1]),
                    modifier = a > b ? parseInt(a/2) : parseInt(b/2);
                return [
                            [edge[0][0] - modifier, edge[0][1] - modifier],
                            [edge[0][0] + modifier, edge[0][1] - modifier],
                            [edge[0][0] + modifier, edge[0][1] + modifier],
                            [edge[0][0] - modifier, edge[0][1] + modifier]
                        ],
                        [
                            [edge[1][0] - modifier, edge[1][1] - modifier],
                            [edge[1][0] + modifier, edge[1][1] - modifier],
                            [edge[1][0] + modifier, edge[1][1] + modifier],
                            [edge[1][0] - modifier, edge[1][1] + modifier]
                        ];
            },
            getBoundingBoxFromEdge = function (edge) {
                var modifier = parseInt(Math.sqrt(Math.pow((edge[1][0] - edge[0][0]), 2) + Math.pow((edge[1][1] - edge[0][1]), 2)) / 3);
                return [
                            [edge[0][0] - modifier, edge[0][1] - modifier],
                            [edge[0][0] + modifier, edge[0][1] - modifier],
                            [edge[1][0] + modifier, edge[1][1] + modifier],
                            [edge[1][0] - modifier, edge[1][1] + modifier]
                       ];
            },
            detect = function () {
                var i,
                    x,
                    a,
                    boundingBox,
                    actorEdges,
                    colliderEdges,
                    corner,
                    edgeBoundingBox,
                    edgeCorner,
                    colliderBoundingBox,
                    edgeCornerBBoxes;

                var layer = colliders.length,
                    collider = null,
                    actor = null,
                    colliderEdges = null,
                    colliderBoundingBox = null,
                    actorBoundingBox = null,
                    colliderEdgeBoundingBox = null,
                    colliderEdgeCornerBoundingBoxes = null,
                    colliderEdgeCorner = null,
                    colliderEdge = null,
                    colliderCorner = null;

                collider = colliders.length;
                while (--collider >= 0) {
                    actor = actors.length;
                    colliderEdges = rotateEdges(colliders[collider].getEdges(), colliders[collider].getRotation());
                    colliderBoundingBox = colliders[collider].getBoundingBox();
                    while (--actor >= 0) {
                        actorBoundingBox = actors[actor].getBoundingBox();
                        if (actors[actor] !== colliders[collider]
                            && (colliderCorner = boxOverlapsWith(colliderBoundingBox, actorBoundingBox)) !== false) {
                            // collision?
                            colliderEdge = colliderEdges.length;
                            while (--colliderEdge >= 0) {
                                colliderEdgeBoundingBox = getBoundingBoxFromEdge(colliderEdges[colliderEdge]);
                                if ((colliderEdgeCorner = boxOverlapsWith(colliderEdgeBoundingBox, actorBoundingBox)) !== false) {
                                    colliderEdgeCornerBoundingBoxes = getBoundingBoxFromEdgeCorners(colliderEdges[colliderEdge]);
                                    if (boxOverlapsWith(colliderEdgeCornerBoundingBoxes[0], actorBoundingBox) !== false
                                        && boxOverlapsWith(colliderEdgeCornerBoundingBoxes[1], actorBoundingBox) !== false) {
                                        colliders[collider].edgeCollisionWith(colliderEdge, actors[actor]);
                                        actors[actor].pointCollisionWith(colliderEdgeCorner, colliders[collider]);
                                    }
                                }
                            }
                            colliders[collider].cornerCollisionWith(colliderCorner, actors[actor]);
                            actors[actor].pointCollisionWith(colliderBoundingBox[colliderCorner], colliders[collider]);
                        }
                    }
                }
            };

        this.registerActor = function (actor) {
            if (actor.isCollider()) {
                colliders.push(actor);
            }
            actors.push(actor);

            DEBUG && console.log(actor.getId(), "registered in collision system");
        };

        this.unregisterActor = function (actor) {
            var index = -1;

            if (actor.isCollider()) {
                if ((index = utils.indexOf(colliders, actor)) !== -1) {
                    colliders.splice(index, 1);
                }
            }

            if ((index = utils.indexOf(actors, actor)) !== -1) {
                actors.splice(index, 1);
                DEBUG && console.log(actor.getId(), "unregistered in collision system");
            }
        };

        this.tick = function () {
            detect();
        };
    };
});
