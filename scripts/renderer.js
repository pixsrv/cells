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

        var entity = {
            cell    : new nsGene.Cell(),
            x       : xm,
            y       : ym,
            angle   : 0,
            velocity: 0,
            mass    : 1
        };
        entity.cell.createMembrane();
        nsGene.world.entities.push(entity);

        nsGene.renderer.render(1);
    });


};


//nsGene.Renderer.prototype.ctx.addEventListener('mousemove', function (e) {
//    if (!running) {
//        clear();
//        ball.x = e.clientX;
//        ball.y = e.clientY;
//        ball.draw();
//    }
//});


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
    var bodyColor = nsGene.colorGene2hex2(genes.bodycolor);
    var membraneColor = nsGene.rgb2hex(genes.membranecolor.value[0], genes.membranecolor.value[1], genes.membranecolor.value[2]);

    var x = entity.x;
    var y = entity.y;
    var r = genes.bodysize.value;
    var startPoint = nsGene.transformRotate(x, y, r, 0, entity.angle);
    var startAngle = 90 + (360 / genes.membranedef.value / 2);

    var membrane = genes.membranepolar.value;

    // draw membrane
    ctx.beginPath();
    ctx.fillStyle = membraneColor;
    ctx.moveTo(startPoint.x, startPoint.y);

    for (var s = 0; s < membrane.length - 1; s++) {
        startPoint = nsGene.transformRotate(startPoint.x, startPoint.y, membrane[s].length, 0, startAngle + (s != 0 ? (s * membrane[s].angleDeg) : 0));
        ctx.lineTo(startPoint.x, startPoint.y);
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

    if (cfg.drawTensors) {
        ctx.beginPath();
        ctx.lineWidth = .08;
        ctx.strokeStyle = "blue";

        for (i = 0; i < membrane.length; i++) {
            point = membrane[i];
            newPoint = nsGene.transformRotate(entity.x, entity.y, r * point[0], 0, point[1]);

            ctx.moveTo(entity.x, entity.y);
            ctx.lineTo(newPoint.x, newPoint.y);
        }
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
