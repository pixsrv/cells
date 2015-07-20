/**
 * Created by pixel on 14.11.13.
 */

window.nsGene = window.nsGene || {};

nsGene.config = {
    isRunning: true,

    seed: 789,

    canvasSizeX: 500,
    canvasSizeY: 500,

    entityInitialCount: 180,
    //entityInitialCount: 66,
    //entityInitialCount: 2,
    //entityInitialCount: 3,
    //entityInitialCount: 5,
    //entityInitialCount: 7,

    entityMinCount: 0,
    entityMaxCount: 2500,
    entityMoveStep: 1,

    viscosity: .5,

    turnMaxCount: -1,

    drawLink   : true,
    drawForces : true,
    drawTensors: true,

    drawIDs     : true,
    drawVertexes: false
};

nsGene.World = function World() {
    this.ctx = document.getElementById("playground").getContext("2d");
    this.ctx.font = "10px Arial";

    this.entities = [];
};

nsGene.World.prototype.go = function () {
    if (arguments[0] == 1) nsGene.config.isRunning = true;
    if (!nsGene.config.isRunning) return;
    if (arguments[0] == 1) nsGene.config.isRunning = false;

    // create shortcut names
    var entities = nsGene.world.entities;
    var config = nsGene.config;

    var entityA;
    var entityB;
    var interaction;
    var minDistance;
    var newPoint;


    // interaction between close entities
    for (var i = 0; i < entities.length; i++) {
        entityA = entities[i];

        var vec = [];

        for (var j = 0; j < entities.length; j++) {
            if (i == j) continue;

            entityB = entities[j];
            interaction = nsGene.calcInteraction(entityA, entityB);
            minDistance = entityA.cell.genes.bodysize.value + entityB.cell.genes.bodysize.value;

            if (interaction.distance < minDistance) {
                vec.push({
                    distance : interaction.distance * entityB.cell.genes.bodysize.value * .1,
                    direction: interaction.direction
                });

                // TODO: calculate reflection
                entityB.velocity = 0;

                // recalc membrane tensors
                /*
                 var factor = interaction.distance / minDistance;
                 var intersections = nsGene.calcIntersection(entityA.cell.genes.bodysize.value, entityB.cell.genes.bodysize.value, interaction.distance);
                 var minRange = interaction.direction - nsGene.toRadians(180) - intersections.alpha1;
                 var maxRange = interaction.direction + nsGene.toRadians(180) + intersections.alpha2;

                 var membrane = entityA.cell.genes.membrane.value;

                 for (var k = 0; k < membrane.length; k++) {
                 var mVertex = membrane[k];

                 if (mVertex[1] > nsGene.toDegrees(minRange) && mVertex[1] < nsGene.toDegrees(maxRange)) {
                 if (mVertex[0] > factor)

                 //mVertex[0] -= mVertex[0] / 10;
                 mVertex[0] = factor;
                 } else {
                 for (var l = 0; l < membrane.length; l++) {
                 if (k == l)continue;
                 if (membrane[l][0] > 1)continue;

                 membrane[l][0] += factor / 23;
                 //membrane[l][0] += factor / 10;
                 }
                 }
                 }
                 */
            }
        }

        if (vec.length != 0) {
            var v = nsGene.calcVectorSum(vec, entityA.x, entityA.y);
            entityA.direction = nsGene.toDegrees(v.direction);
            entityA.velocity = (2 * entityB.cell.genes.bodysize.value) / Math.abs(v.distance);
        } else {
            entityA.velocity -= config.viscosity / entityB.cell.genes.bodysize.value;
            entityA.velocity = entityA.velocity < 0 ? 0 : entityA.velocity;
        }

        // move and validate position within world boundaries
        newPoint = nsGene.transformRotate(entityA.x, entityA.y, entityA.velocity, 0, entityA.direction);

        // horizontal
        if (newPoint.x < entityA.cell.genes.bodysize.value + 2) {
            entityA.x = entityA.cell.genes.bodysize.value + 2;
            // TODO: calculate reflection
            entityA.velocity=0;
        } else {
            if (newPoint.x > config.canvasSizeX - entityA.cell.genes.bodysize.value - 2) {
                entityA.x = config.canvasSizeX - entityA.cell.genes.bodysize.value - 2;
                entityA.velocity=0;
            } else {
                entityA.x = newPoint.x;
            }
        }

        // vertical
        if (newPoint.y < entityA.cell.genes.bodysize.value + 2) {
            entityA.y = entityA.cell.genes.bodysize.value + 2;
            entityA.velocity=0;
        } else {
            if (newPoint.y > config.canvasSizeX - entityA.cell.genes.bodysize.value - 2) {
                entityA.y = config.canvasSizeX - entityA.cell.genes.bodysize.value - 2;
                entityA.velocity=0;
            } else {
                entityA.y = newPoint.y;
            }
        }
    }


    // animation part
    // clear canvas
    nsGene.world.ctx.clearRect(0, 0, config.canvasSizeX, config.canvasSizeY);

    // redraw entities
    nsGene.world.redraw();

    // request new frame
    //webkitRequestAnimationFrame(nsGene.world.go);
    requestAnimationFrame(nsGene.world.go);
};

nsGene.World.prototype.redraw = function () {
    for (var i = 0; i < nsGene.world.entities.length; i++) {
        var e = nsGene.world.entities[i];
        e.cell.draw(e, i);
    }
};