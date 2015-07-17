/**
 * Created by pixel on 14.11.13.
 */

window.nsGene = window.nsGene || {};

nsGene.config = {
    isRunning: true,

    entityMoveStep: 1,
    canvasSizeX   : 500,
    canvasSizeY   : 500,

    entityInitialCount: 70,
    entityMinCount    : 0,
    entityMaxCount    : 2500,

    turnMaxCount: -1,

    drawForces: true
};

nsGene.World = function World() {
    this.ctx = document.getElementById("playground").getContext("2d");
    this.entities = [];

    nsGene.seed = 789;
};

nsGene.World.prototype.go = function () {
    // create shortcut names
    var entities = nsGene.world.entities;
    var config = nsGene.config;

    var entityCount = entities.length;
    var entityA;
    var entityB;
    var interaction;
    var minDistance;
    var newPoint;

    // interaction between close entities
    for (i = 1; i < entityCount; i++) {
        entityA = entities[i];

        for (var j = 1; j < entityCount; j++) {
            if (i == j) continue;

            entityB = entities[j];
            interaction = nsGene.calcInteraction(entityA, entityB);
            minDistance = entityA.entity.genes.bodysize.value + entityB.entity.genes.bodysize.value;

            if (interaction.distance < minDistance) {
                entityA.angle = nsGene.toDegrees(interaction.angle) + nsGene.randomRange(-15, 15);
                entityB.angle = nsGene.toDegrees(interaction.angle) - 180 + nsGene.randomRange(-15, 15);

                entityA.velocity = entityA.entity.genes.bodysize.value * (5 / interaction.distance);
                entityB.velocity = entityB.entity.genes.bodysize.value * (5 / interaction.distance);
            }

            if (interaction.distance < minDistance / 5) {
                entityA.velocity = Math.floor((nsGene.random() * 10));
                entityB.velocity = Math.floor((nsGene.random() * 10));
            }
        }

        // move and validate position within world boundaries
        newPoint = nsGene.transformRotate(entityA.x, entityA.y, entityA.velocity / 10, 0, entityA.angle);

        // horizontal
        if (newPoint.x < entityA.entity.genes.bodysize.value + 2) {
            entityA.x = entityA.entity.genes.bodysize.value + 2;
            entityA.angle = nsGene.toDegrees(0) + nsGene.randomRange(-15, 15);
        } else {
            if (newPoint.x > config.canvasSizeX - entityA.entity.genes.bodysize.value - 2) {
                entityA.x = config.canvasSizeX - entityA.entity.genes.bodysize.value - 2;
                entityA.angle = nsGene.toDegrees(180) + nsGene.randomRange(-15, 15);
            } else {
                entityA.x = newPoint.x;
            }
        }

        // vertical
        if (newPoint.y < entityA.entity.genes.bodysize.value + 2) {
            entityA.y = entityA.entity.genes.bodysize.value + 2;
            entityA.angle = nsGene.toDegrees(90) + nsGene.randomRange(-15, 15);
        } else {
            if (newPoint.y > config.canvasSizeX - entityA.entity.genes.bodysize.value - 2) {
                entityA.y = config.canvasSizeX - entityA.entity.genes.bodysize.value - 2;
                entityA.angle = nsGene.toDegrees(270) + nsGene.randomRange(-15, 15);
            } else {
                entityA.y = newPoint.y;
            }
        }

        entityA.velocity -= entityA.velocity / 10;

        if (entityA.velocity < 1) {
            //entityA.angle = Math.floor((nsGene.random() * 360));
            //entityA.velocity = Math.floor((nsGene.random() * 20));
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
        e.entity.draw(e);
    }
};