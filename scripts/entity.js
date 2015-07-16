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
        "bodysize": new nsGene.Gene2({
            "isInheritable": true,
            "isEvolvable"  : true,
            "isMutable"    : true,
            "value"        : 15,
            "min"          : 3,
            "max"          : "undefined"
        })
    };

    this.links = [];
};

nsGene.Entity.prototype.draw = function (x, y) {
    var fillColor = "white";
    var lineColor = "darkgreen";

    // nucleus
    nsGene.world.ctx.beginPath();
    nsGene.world.ctx.arc(x, y, this.genes.bodysize.value, 0, 2 * Math.PI);
    nsGene.world.ctx.fillStyle = fillColor;
    nsGene.world.ctx.fill();
    //nsGene.world.ctx.lineWidth = 2;
    //nsGene.world.ctx.strokeStyle = lineColor;
    nsGene.world.ctx.closePath();
    nsGene.world.ctx.stroke();
};