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
            //"value"        : 20,
            //"value"        : 160,
            //"value"        : 132,
            //"value"        : 15 + nsGene.randomRange(-8, 12),
            //"value"        : 110,
            //"value"        : 100,
            "value"        : 80 + nsGene.randomRange(-55, 30),
            "min"          : 3,
            "max"          : undefined
        }),
        "bodycolor"        : new nsGene.Gene2({
            "isInheritable": true,
            "isEvolvable"  : true,
            "isMutable"    : true,
            "value"        : [nsGene.randomRange(200, 255), nsGene.randomRange(200, 255), nsGene.randomRange(200, 255)],
            "min"          : [0, 0, 0],
            "max"          : [255, 255, 255]
        }),
        "membranepolar"    : new nsGene.Gene2({
            "isInheritable": true,
            "isEvolvable"  : true,
            "isMutable"    : true,
            "value"        : [],
            "min"          : undefined,
            "max"          : undefined
        }),
        "membranedef"      : new nsGene.Gene2({
            "isInheritable": true,
            "isEvolvable"  : true,
            "isMutable"    : true,
            "value"        : 12,
            "min"          : undefined,
            "max"          : undefined
        }),
        "membranexy"       : new nsGene.Gene2({
            "isInheritable": true,
            "isEvolvable"  : true,
            "isMutable"    : true,
            "value"        : undefined,
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

nsGene.Cell.prototype.createMembrane = function (perfect) {
    // membrane segment is an oriented vector
    var genes = this.genes;
    var segments = genes.membranedef.value;
    var bodySize = genes.bodysize.value;

    var angleDeg = 360 / segments;
    var length = 2 * bodySize * Math.sin(nsGene.toRadians(angleDeg / 2));

    for (var s = 0; s < segments; s++) {
        var segment = {
            index   : s,
            length  : length + (perfect ? 0 : nsGene.randomRange(-length / .5, length / .5)),
            angleDeg: angleDeg + (perfect ? 0 : nsGene.randomRange(-angleDeg / 3, angleDeg / 3))
        };

        genes.membranepolar.value.push(segment)
    }
};

nsGene.Cell.prototype.process = function (entity) {
    var genes = entity.cell.genes;

    var x = entity.x;
    var y = entity.y;
    var r = genes.bodysize.value;
    var startPoint = nsGene.transformRotate(x, y, r, 0, entity.angle);
    var startAngle = 90 + (360 / genes.membranedef.value / 2);

    var membrane = genes.membranepolar.value;
    var angleDeg = 360 / membrane.length;
    var perfectLength = 2 * r * Math.sin(nsGene.toRadians(angleDeg / 2));


    // process membrane
    var point;
    for (var s = 0; s < membrane.length - 1; s++) {
        var segment = membrane[s];
        var a = segment.angleDeg;
        var l = segment.length;

        var lengthDiff = (perfectLength - l) / nsGene.randomRange(50, 80);
        lengthDiff = Math.abs(lengthDiff) < .0001 ? .0001 : lengthDiff;

        var angleDiff = (angleDeg - a) / nsGene.randomRange(50, 100);
        angleDiff = Math.abs(angleDiff) < .0001 ? .0001 : angleDiff;

        if (s == 0) {
            point = nsGene.transformRotate(startPoint.x, startPoint.y, l + lengthDiff, 0, startAngle);
        } else {
            point = nsGene.transformRotate(startPoint.x, startPoint.y, l + lengthDiff, 0, startAngle + (s * a + angleDiff));
        }
        startPoint = point;
        segment.angleDeg = a + angleDiff;
        segment.length = l + lengthDiff;
    }

};


