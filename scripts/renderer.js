/**
 * Created on 2015-07-23.
 */

window.nsGene = window.nsGene || {};


/**
 *
 * @constructor
 */
nsGene.Renderer = function Renderer() {
    nsGene.Renderer.prototype.canvas = document.getElementById("playground");
    nsGene.Renderer.prototype.ctx = nsGene.Renderer.prototype.canvas.getContext("2d");
    nsGene.Renderer.prototype.ctx.font = "10px Arial";

    nsGene.Renderer.prototype.canvas.addEventListener("click", function (e) {
        var xm = e.clientX;
        var ym = e.clientY;

/*
        var entity = {
            cell    : new nsGene.Cell(),
            x       : xm,
            y       : ym,
            angle   : 0,
            velocity: 0,
            mass    : 1
        };
        entity.crossing = [];
        entity.cell.createMembranePolar();
        entity.cell.membranePolar2Cartesian(entity);
        nsGene.world.entities.push(entity);
*/

        //temp: test adding points to membrane
         var entity = nsGene.world.entities[0];
         var p = entity.cell.genes.membranePolar.value[0];

         // first point splits into two
         entity.cell.genes.membranePolar.value.splice(entity.cell.genes.membranePolar.value.length - 1, 0, p);

        nsGene.renderer.render(1);
    });

    nsGene.Renderer.prototype.canvas.addEventListener('mousemove', function (e) {
        var entity = nsGene.world.entities[0];

        entity.x = e.clientX;
        entity.y = e.clientY;
    });
};


//nsGene.Renderer.prototype.ctx.addEventListener("mouseout", function (e) {
//    window.cancelAnimationFrame(raf);
//    running = false;
//});


nsGene.Renderer.prototype.render = function () {
    // clear canvas
    nsGene.Renderer.prototype.ctx.clearRect(0, 0, nsGene.config.canvasSizeX, nsGene.config.canvasSizeY);

    nsGene.Renderer.prototype.redraw();

    //window.requestAnimationFrame(nsGene.Renderer.prototype.render, arguments[0]);
    window.requestAnimationFrame(nsGene.World.prototype.run, arguments[0]);
};


nsGene.Renderer.prototype.redraw = function () {

    // draw world (ie solvent and obstacles)

    // draw entities
    for (var e = 0; e < nsGene.world.entities.length; e++) {
        var entity = nsGene.world.entities[e];

        nsGene.Renderer.prototype.drawEntity(entity);
    }
};


/**
 *
 * @param entity
 */
nsGene.Renderer.prototype.drawEntity = function (entity) {
    var ctx = this.ctx;
    var cfg = nsGene.config;

    var genes = entity.cell.genes;
    var bodyColor = nsGene.colorGene2hex2(genes.bodyColor);
    var membraneColor = nsGene.rgb2hex(genes.membraneColor.value[0], genes.membraneColor.value[1], genes.membraneColor.value[2]);

    var x = entity.x;
    var y = entity.y;

    var membraneXY = genes.membraneXY.value;

    // draw membrane
    ctx.beginPath();
    ctx.fillStyle = membraneColor;

    for (var s = 0; s < membraneXY.length; s++) {
        var point = membraneXY[s];
        if (s == 0) {
            ctx.moveTo(point.x, point.y);
            continue;
        }
        ctx.lineTo(point.x, point.y);
    }

    ctx.closePath();

    // draw body (inside)
    if (entity.velocity > 0.001)
        ctx.fillStyle = "rgba(255, 200, 200, .5)";
    else
        ctx.fillStyle = bodyColor;

    ctx.fill();
    ctx.lineWidth = genes.membraneThickness.value;
    ctx.strokeStyle = membraneColor;
    ctx.stroke();

    // draw crossing line
    if (entity.crossing.length > 1) {
        ctx.beginPath();
        ctx.moveTo(entity.crossing[0].x, entity.crossing[0].y);
        ctx.lineTo(entity.crossing[1].x, entity.crossing[1].y);
        ctx.lineWidth = genes.membraneThickness.value;
        ctx.strokeStyle = membraneColor;
        ctx.stroke();
    }

    if (cfg.drawForces) {
        newPoint = nsGene.transformRotate(x, y, entity.velocity * 20, 0, entity.direction);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(newPoint.x, newPoint.y);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "red";
        ctx.stroke();
    }

    if (cfg.drawIDs) {
        //ctx.fillStyle = "black";
        //ctx.fillText(id, x, y);
    }
};
