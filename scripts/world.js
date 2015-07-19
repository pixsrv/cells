/**
 * Created by pixel on 14.11.13.
 */

window.nsGene = window.nsGene || {};

nsGene.config = {
    isRunning: true,

    seed: 789,

    canvasSizeX: 500,
    canvasSizeY: 500,

    entityInitialCount: 75,
    //entityInitialCount: 66,
    //entityInitialCount: 2,
    //entityInitialCount: 5,

    entityMinCount: 0,
    entityMaxCount: 2500,
    entityMoveStep: 1,

    turnMaxCount: -1,

    drawLink   : true,
    drawForces : true,
    drawTensors: true,

    drawIDs     : true,
    drawVertexes: true
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
    for (var i = 1; i < entities.length; i++) {
        entityA = entities[i];

        var vec = [];

        for (var j = 1; j < entities.length; j++) {
            if (i == j) continue;

            entityB = entities[j];
            interaction = nsGene.calcInteraction(entityA, entityB);
            minDistance = entityA.cell.genes.bodysize.value + entityB.cell.genes.bodysize.value;

            if (interaction.distance < minDistance) {
                vec.push({
                    distance : interaction.distance,
                    direction: interaction.direction
                });
            }
        }

        if (vec.length != 0) {
            var v = nsGene.calcVectorSum(vec, entityA.x, entityA.y);
            var aDeg = nsGene.toDegrees(v.direction);
            entityA.direction = aDeg + nsGene.randomRange(-10, 10);
            entityA.velocity = entityA.cell.genes.bodysize.value * (5 / v.distance);
        } else {
            entityA.direction = 0;
            entityA.velocity = 0;
        }

        // move and validate position within world boundaries
        newPoint = nsGene.transformRotate(entityA.x, entityA.y, entityA.velocity / 2, 0, entityA.direction);

        // horizontal
        if (newPoint.x < entityA.cell.genes.bodysize.value + 2) {
            entityA.x = entityA.cell.genes.bodysize.value + 2;
        } else {
            if (newPoint.x > config.canvasSizeX - entityA.cell.genes.bodysize.value - 2) {
                entityA.x = config.canvasSizeX - entityA.cell.genes.bodysize.value - 2;
            } else {
                entityA.x = newPoint.x;
            }
        }

        // vertical
        if (newPoint.y < entityA.cell.genes.bodysize.value + 2) {
            entityA.y = entityA.cell.genes.bodysize.value + 2;
        } else {
            if (newPoint.y > config.canvasSizeX - entityA.cell.genes.bodysize.value - 2) {
                entityA.y = config.canvasSizeX - entityA.cell.genes.bodysize.value - 2;
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
    for (var i = 1; i < nsGene.world.entities.length; i++) {
        var e = nsGene.world.entities[i];
        e.cell.draw(e, i);
    }
};