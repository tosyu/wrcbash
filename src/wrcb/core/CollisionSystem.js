mamd.define("wrcb.core.CollisionSystem", function () {
    return function () {
        var collidersLayers = [],
            actorsLayers = [],
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

                var layer = collidersLayers.length,
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

                while (--layer >= 0) {
                    collider = !!collidersLayers[layer] && collidersLayers[layer].length;
                    if (!collider || collider === 0) {
                        continue;
                    }
                    while (--collider >= 0) {
                        actor = !!actorsLayers[layer] && actorsLayers[layer].length;
                        if (!actor || actor === 0) {
                            continue;
                        }
                        colliderEdges = rotateEdges(collidersLayers[layer][collider].getEdges(), collidersLayers[layer][collider].getRotation());
                        colliderBoundingBox = collidersLayers[layer][collider].getBoundingBox();
                        while (--actor >= 0) {
                            actorBoundingBox = actorsLayers[layer][actor].getBoundingBox();
                            if (actorsLayers[layer][actor] !== collidersLayers[layer][collider]
                                && (colliderCorner = boxOverlapsWith(colliderBoundingBox, actorBoundingBox)) !== false) {
                                // collision?
                                colliderEdge = colliderEdges.length;
                                while (--colliderEdge >= 0) {
                                    colliderEdgeBoundingBox = getBoundingBoxFromEdge(colliderEdges[colliderEdge]);
                                    if ((colliderEdgeCorner = boxOverlapsWith(colliderEdgeBoundingBox, actorBoundingBox)) !== false) {
                                        colliderEdgeCornerBoundingBoxes = getBoundingBoxFromEdgeCorners(colliderEdges[colliderEdge]);
                                        if (boxOverlapsWith(colliderEdgeCornerBoundingBoxes[0], actorBoundingBox) !== false
                                            && boxOverlapsWith(colliderEdgeCornerBoundingBoxes[1], actorBoundingBox) !== false) {
                                            collidersLayers[layer][collider].edgeCollisionWith(colliderEdge, actorsLayers[layer][actor]);
                                            actorsLayers[layer][actor].pointCollisionWith(colliderEdgeCorner, collidersLayers[layer][collider]);
                                        }
                                    }
                                }
                                collidersLayers[layer][collider].cornerCollisionWith(colliderCorner, actorsLayers[layer][actor]);
                                actorsLayers[layer][actor].pointCollisionWith(colliderBoundingBox[colliderCorner], collidersLayers[layer][collider]);
                            }
                        }
                    }
                }


                /*for (i in this.colliders) {
                    if (this.colliders.hasOwnProperty(i)) {
                        colliderEdges = this.edgesRotate(this.colliders[i].getEdges(), this.colliders[i].getRotation());
                        colliderBoundingBox = this.colliders[i].getBoundingBox();
                        for (x in this.actors) {
                            if (this.actors.hasOwnProperty(x) && this.actors[x].getId() !== this.colliders[i].getId()) {
                                if ((corner = this.boxOverlapsWith(colliderBoundingBox, this.actors[x].getBoundingBox())) !== false) {
                                    for (a in colliderEdges) {
                                        edgeBoundingBox = this.getBoundingBoxFromEdge(colliderEdges[a]);
                                        if ((edgeCorner = this.boxOverlapsWith(edgeBoundingBox, this.actors[x].getBoundingBox())) !== false) {
                                            edgeCornerBBoxes = this.getBoundingBoxFromEdgeCorners(colliderEdges[a]);
                                            if (this.boxOverlapsWith(edgeCornerBBoxes["box1"], this.actors[x].getBoundingBox()) !== false
                                             && this.boxOverlapsWith(edgeCornerBBoxes["box2"], this.actors[x].getBoundingBox()) !== false) {
                                                this.colliders[i].edgeCollisioboxOverlapsWith() nWith(parseInt(a), this.actors[x]);
                                                this.actors[x].pointCollisionWith(edgeBoundingBox[corner], this.colliders[i]);
                                            }
                                        }
                                    }
                                    this.colliders[i].cornerCollisionWith(corner, this.actors[x]);
                                    this.actors[x].pointCollisionWith(colliderBoundingBox[corner], this.colliders[i]);
                                    edgeBoundingBox = null;
                                }
                                actorEdges = null;
                            }
                        }

                        if (this.colliders[i].isCollidingWithScreen() === true) {
                            if (colliderBoundingBox[0]["x"] <= 0) {
                                this.colliders[i].edgeCollisionWith(3); //wall left side bump
                            } else if (colliderBoundingBox[1]["x"] >= this.scene.viewport.width) {
                                this.colliders[i].edgeCollisionWith(1); //wall right side bump
                            }

                            if (colliderBoundingBox[0]["y"] <= 0) {
                                this.colliders[i].edgeCollisionWith(0); //wall top side bump
                            } else if (colliderBoundingBox[2]["y"] >= this.scene.viewport.height) {
                                this.colliders[i].edgeCollisionWith(2); //wall bottom side bump
                            }
                        }
                        colliderEdges = null;
                        colliderBoundingBox = null;
                    }
                }*/
            };

        this.registerActor = function (actor, layer) {
            var _layer = layer || 0;
            if (actor.isCollider()) {
                if (!collidersLayers[layer]) {
                    collidersLayers[layer] = [];
                }
                collidersLayers[layer].push(actor);
            }

            if (!actorsLayers[layer]) {
                actorsLayers[layer] = [];
            }

            actorsLayers[layer].push(actor);

            console.log(actor.getId(), "registered in collision system");
        };

        this.unregisterActor = function (actor, layer) {
            var _layer = layer || 0,
                index = -1;

            if (actor.isCollider()) {
                if (!collidersLayers[layer]) {
                    throw "Layer in collisions does not exist!";
                }

                if ((index = utils.indexOf(collidersLayers, actor)) !== -1) {
                    collidersLayers[layer].splice(index, 1);
                    if (collidersLayers[layer].length === 0) {
                        delete collidersLayers[layer];
                    }
                }
            }

            if (!actorsLayers[layer]) {
                throw "Layer in collisions does not exist!";
            }

            if ((index = utils.indexOf(actorsLayers, actor)) !== -1) {
                actorsLayers[layer].splice(index, 1);
                if (actorsLayers[layer].length === 0) {
                    delete actorsLayers[layer];
                }
                console.log(actor.getId(), "unregistered in collision system");
            }
        };

        this.tick = function () {
            detect();
        };
    };
});
