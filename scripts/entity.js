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

nsGene.Entity = function Entity() {

    this.genes = {
        "bodysize" : new nsGene.Gene2({
            "isInheritable": true,
            "isEvolvable"  : true,
            "isMutable"    : true,
            "value"        : 15 + nsGene.randomRange(-10, 15),
            "min"          : 3,
            "max"          : "undefined"
        }),
        "bodycolor": new nsGene.Gene2({
            "isInheritable": true,
            "isEvolvable"  : true,
            "isMutable"    : true,
            "value"        : [200, 255, 200],
            "min"          : [0, 0, 0],
            "max"          : [255, 255, 255]
        }),
        "membranecolor": new nsGene.Gene2({
            "isInheritable": true,
            "isEvolvable"  : true,
            "isMutable"    : true,
            "value"        : [50, 100, 50],
            "min"          : [0, 0, 0],
            "max"          : [255, 255, 255]
        })
    };

    this.links = [];
};

nsGene.Entity.prototype.draw = function (x, y) {
    var ctx = nsGene.world.ctx;
    var fillColor = "white";
    var lineColor = "darkgreen";

    // nucleus (circle)
    nsGene.world.ctx.beginPath();
    nsGene.world.ctx.arc(x, y, this.genes.bodysize.value, 0, 2 * Math.PI);
    nsGene.world.ctx.fillStyle = fillColor;
    nsGene.world.ctx.fill();
    nsGene.world.ctx.closePath();
    nsGene.world.ctx.stroke();

    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = lineColor;
    ctx.stroke();
};

nsGene.Entity.prototype.draw2 = function (e) {
    var ctx = nsGene.world.ctx;
    var fillColor = "rgba(" + e.entity.genes.bodycolor.value[0] + "," + e.entity.genes.bodycolor.value[1] + "," + e.entity.genes.bodycolor.value[2] + ",1.0)";
    var lineColor = "rgba(" + e.entity.genes.membranecolor.value[0] + "," + e.entity.genes.membranecolor.value[1] + "," + e.entity.genes.membranecolor.value[2] + ",1.0)";

    //denser bezier
    /*
     var a = .278;
     var b = .530;
     var c = .712;
     var d = .886;

     var p = [
     {x: -1, y: -a},
     {x: -d, y: -b},
     {x: -c, y: -c},
     {x: -b, y: -d},
     {x: -a, y: -1}
     ];
     */

    var x = e.x;
    var y = e.y;
    var bs = this.genes.bodysize.value;

    // nucleus bezier
    ctx.beginPath();
    ctx.moveTo(x - bs, y);
    ctx.bezierCurveTo(x - bs, y - (bs * 0.548), x - (bs * 0.548), y - bs, x, y - bs);
    ctx.bezierCurveTo(x + (bs * 0.548), y - (bs), x + bs, y - (bs * 0.548), x + bs, y);
    ctx.bezierCurveTo(x + (bs), y + (bs * 0.548), x + (bs * 0.548), y + bs, x, y + bs);
    ctx.bezierCurveTo(x - (bs * 0.548), y + (bs), x - (bs), y + (bs * 0.548), x - (bs), y);

    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = lineColor;
    ctx.stroke();

    // direction and velocity
/*
    var vec = nsGene.transformRotate(x, y, e.velocity, 0, e.angle);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(vec.x, vec.y);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";
*/
    ctx.stroke();
};