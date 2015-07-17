/**
 * Created by pixel on 14.11.13.
 */

window.nsGene = window.nsGene || {};

nsGene.config = {
    isRunning: true,

    entityMoveStep: 1,
    canvasSizeX   : 500,
    canvasSizeY   : 500,

    entityInitialCount: 65,
    entityMinCount    : 0,
    entityMaxCount    : 2500,

    turnMaxCount: -1
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

    // interaction between close entities
    for (i = 1; i < entityCount; i++) {
        var entityA = entities[i];

        if (entities.length < 3)
            var f = 0;

        for (var j = 1; j < entityCount; j++) {
            if (i == j) continue;

            var entityB = entities[j];

            var interaction = nsGene.calcInteraction(entityA, entityB);

            // minimum distance
            var mD = entityA.entity.genes.bodysize.value + entityB.entity.genes.bodysize.value;

            if (interaction.distance < mD) {
                entityA.angle = nsGene.toDegrees(interaction.angle) + nsGene.randomRange(-30, 30);
                entityB.angle = nsGene.toDegrees(interaction.angle) - 180 + nsGene.randomRange(-30, 30);

                entityA.velocity = interaction.distance/10;
                entityB.velocity = interaction.distance/10;
            }
            if(interaction.distance == 0){
                entityA.velocity = Math.floor((nsGene.random() * 10));
                entityB.velocity = Math.floor((nsGene.random() * 10));
            }
        }

        // move and validate position within world boundries
        var x = entityA.x;
        var y = entityA.y;

        var np = nsGene.transformRotate(x, y, entityA.velocity / 10, 0, entityA.angle);
        x = np.x;
        y = np.y;

        entityA.velocity -= entityA.velocity / 10;
        entityA.x = x < entityA.entity.genes.bodysize.value ? entityA.entity.genes.bodysize.value : x > config.canvasSizeX - entityA.entity.genes.bodysize.value ? config.canvasSizeX - entityA.entity.genes.bodysize.value : x;
        entityA.y = y < entityA.entity.genes.bodysize.value ? entityA.entity.genes.bodysize.value : y > config.canvasSizeY - entityA.entity.genes.bodysize.value ? config.canvasSizeY - entityA.entity.genes.bodysize.value : y;

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
    var lineColor = "darkgreen";
    var link;
    var dx;
    var dy;
    var alpha;
    var arc = Math.PI / 8;
    var dist;

    for (var i = 1; i < nsGene.world.entities.length; i++) {
        var e = nsGene.world.entities[i];
        //e.entity.draw(e.x, e.y);
        e.entity.draw2(e);

        /*
         for (var l = 0; l < e.entity.links.length; l++) {
         link = e.entity.links[l];

         dx = e.x - link.x;
         dy = e.y - link.y;
         dist = parseInt(Math.sqrt((dx) * (dx) + (dy) * (dy)));

         switch (nsGene.quarter(e.x, e.y, link.x, link.y)) {
         case 1:
         alpha = Math.atan(dy / dx);
         break;
         case 2:
         alpha = Math.atan(dy / dx) - (Math.PI);
         break;
         case 3:
         alpha = Math.atan(dy / dx) + (Math.PI);
         break;
         case 4:
         alpha = Math.atan(dy / dx);
         break;
         }

         // draw connection
         var is = nsGene.calcIntersection(e.entity.genes.bodysize.value, e.entity.genes.bodysize.value, dist);

         nsGene.world.ctx.beginPath();
         nsGene.world.ctx.arc(e.x, e.y, e.entity.genes.bodysize.value, alpha - is.alpha1, alpha + is.alpha1, true);
         nsGene.world.ctx.fillStyle = "white";
         nsGene.world.ctx.fill();
         nsGene.world.ctx.lineWidth = 3;

         // draw link between centers
         var tr = nsGene.transformRotate(e.entity.genes.bodysize.value+1, 0, alpha + is.alpha1);
         nsGene.world.ctx.moveTo(e.x + tr.x, e.y + tr.y);
         var tr1 = nsGene.transformRotate(e.entity.genes.bodysize.value+1, 0, alpha - is.alpha1);
         nsGene.world.ctx.lineTo(e.x + tr1.x, e.y + tr1.y);
         nsGene.world.ctx.lineWidth = 1.5;
         nsGene.world.ctx.lineJoin = "round";
         nsGene.world.ctx.strokeStyle = "darkgreen";
         nsGene.world.ctx.stroke();
         }
         */

        //e.entity.links.splice(0, e.entity.links.length);
    }
};