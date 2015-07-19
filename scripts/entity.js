/**
 * Created by pixel on 14.11.13.
 */

window.nsGene = window.nsGene || {};

nsGene.Gene2 = function Gene2(/*geneAsObject*/) {
    var g = arguments[0];

    for (var a in g) {
        this[a] = g[a];
    }
};

nsGene.Cell = function Cell() {

    this.genes = {
        "bodysize"         : new nsGene.Gene2({
            "isInheritable": true,
            "isEvolvable"  : true,
            "isMutable"    : true,
            "value"        : 15 + nsGene.randomRange(-10, 32),
            //"value"        : 20,
            //"value"        : 160,
            //"value"        : 102,
            "min"          : 3,
            "max"          : undefined
        }),
        "bodycolor"        : new nsGene.Gene2({
            "isInheritable": true,
            "isEvolvable"  : true,
            "isMutable"    : true,
            "value"        : [200, 255, 200],
            "min"          : [0, 0, 0],
            "max"          : [255, 255, 255]
        }),
        "membrane"         : new nsGene.Gene2({
            "isInheritable": true,
            "isEvolvable"  : true,
            "isMutable"    : true,
            /** membrane construction
             * [radiusMultiplier1, angleDeg1, radiusMultiplier2, angleDeg2, ..., radiusMultiplierN, angleDegN]
             */
            "value"        : [
                [1, 0], [1, 15], [1, 30], [1, 45], [1, 60], [1, 75], [1, 90], [1, 105], [1, 120], [1, 135], [1, 150], [1, 165], [1, 180],
                [1, 195], [1, 210], [1, 225], [1, 240], [1, 255], [1, 270], [1, 285], [1, 300], [1, 315], [1, 330], [1, 345]
            ],
            "min"          : undefined,
            "max"          : undefined
        }),
        "membranecolor"    : new nsGene.Gene2({
            "isInheritable": true,
            "isEvolvable"  : true,
            "isMutable"    : true,
            "value"        : [50, 100, 50],
            "min"          : [0, 0, 0],
            "max"          : [255, 255, 255]
        }),
        "membraneThickness": new nsGene.Gene2({
            "isInheritable": true,
            "isEvolvable"  : true,
            "isMutable"    : true,
            "value"        : 2,
            "min"          : 1,
            "max"          : 5
        })
    };
};

nsGene.Cell.prototype.draw = function (e, id) {
    var ctx = nsGene.world.ctx;
    var cfg = nsGene.config;

    var genes = e.cell.genes;
    var bodyColor = nsGene.colorGene2hex2(genes.bodycolor);
    var membraneColor = nsGene.rgb2hex(genes.membranecolor.value[0], genes.membranecolor.value[1], genes.membranecolor.value[2]);

    var x = e.x;
    var y = e.y;
    var r = genes.bodysize.value;
    var membrane = e.cell.genes.membrane.value;

    var point;
    var newPoint;

    // nucleus polyline
    ctx.beginPath();

    // draw membrane
    ctx.fillStyle = membraneColor;
    for (var i = 0; i < membrane.length; i++) {
        point = membrane[i];

        newPoint = nsGene.transformRotate(e.x, e.y, r * point[0], 0, point[1]);

        if (i == 0 && cfg.drawVertexes)
            ctx.fillText(i, newPoint.x, newPoint.y);


        if (i == 0) {
            ctx.moveTo(newPoint.x, newPoint.y);
            continue;
        }

        ctx.lineTo(newPoint.x, newPoint.y);
    }
    ctx.closePath();

    // draw body (inside)
    if (e.velocity > 0.001)
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
            newPoint = nsGene.transformRotate(e.x, e.y, r * point[0], 0, point[1]);

            ctx.moveTo(e.x, e.y);
            ctx.lineTo(newPoint.x, newPoint.y);
        }
        ctx.stroke();
    }

    if (cfg.drawForces) {
        newPoint = nsGene.transformRotate(x, y, e.velocity*5, 0, e.direction);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(newPoint.x, newPoint.y);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "red";
        ctx.stroke();
    }

    if (cfg.drawIDs) {
        ctx.fillStyle = "black";
        ctx.fillText(id, x, y);
    }
};