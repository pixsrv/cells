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
        "bodySize"             : new nsGene.Gene2({
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
        "bodyColor"            : new nsGene.Gene2({
            "isInheritable": true,
            "isEvolvable"  : true,
            "isMutable"    : true,
            "value"        : [nsGene.randomRange(200, 255), nsGene.randomRange(200, 255), nsGene.randomRange(200, 255)],
            "min"          : [0, 0, 0],
            "max"          : [255, 255, 255]
        }),
        "membraneRoughness"        : new nsGene.Gene2({
            "isInheritable": true,
            "isEvolvable"  : true,
            "isMutable"    : true,
            "value"        : 12,
            "min"          : 3,
            "max"          : 48
        }),
        "membranePolar"        : new nsGene.Gene2({
            "isInheritable": true,
            "isEvolvable"  : true,
            "isMutable"    : true,
            "value"        : [],
            "min"          : undefined,
            "max"          : undefined
        }),
        "membraneXY"           : new nsGene.Gene2({
            "isInheritable": true,
            "isEvolvable"  : true,
            "isMutable"    : true,
            "value"        : [],
            "min"          : undefined,
            "max"          : undefined
        }),
        "membraneColor"        : new nsGene.Gene2({
            "isInheritable": true,
            "isEvolvable"  : true,
            "isMutable"    : true,
            "value"        : [50, 100, 50],
            "min"          : [0, 0, 0],
            "max"          : [255, 255, 255]
        }),
        "membraneThickness"    : new nsGene.Gene2({
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
    var segments = genes.membraneRoughness.value;
    var bodySize = genes.bodySize.value;

    var angleDeg = 360 / segments;
    var length = 2 * bodySize * Math.sin(nsGene.toRadians(angleDeg / 2));

    for (var s = 0; s < segments; s++) {
        var segment = {
            index   : s,
            length  : length + (perfect ? 0 : nsGene.randomRange(-length / .5, length / .5)),
            angleDeg: angleDeg + (perfect ? 0 : nsGene.randomRange(-angleDeg / 3, angleDeg / 3))
        };

        genes.membranePolar.value.push(segment);
    }
};

nsGene.Cell.prototype.process = function (entity) {
    var genes = entity.cell.genes;
    var membrane = genes.membranePolar.value;

    var x = entity.x;
    var y = entity.y;
    var r = genes.bodySize.value;

    var startPoint = nsGene.transformRotate(x, y, r, 0, entity.angle);

    var perfectAngleDeg = 360 / membrane.length;
    var perfectLength = 2 * r * Math.sin(nsGene.toRadians(perfectAngleDeg / 2));


    // process membrane
    for (var s = 0; s < membrane.length - 1; s++) {
        var segment = membrane[s];
        var a = segment.angleDeg;
        var l = segment.length;

        var lengthDiff = (perfectLength - l) / nsGene.randomRange(30, 50);
        lengthDiff = Math.abs(lengthDiff) < .0001 ? .0001 : lengthDiff;

        var angleDiff = (perfectAngleDeg - a) / nsGene.randomRange(100, 200);
        angleDiff = Math.abs(angleDiff) < .0001 ? .0001 : angleDiff;

        segment.angleDeg = a + angleDiff;
        segment.length = l + lengthDiff;
    }

    nsGene.Cell.prototype.convertMembrane2Cartesian(entity);
};


nsGene.Cell.prototype.convertMembrane2Cartesian = function (entity) {
    // TODO: move to utils
    var genes = entity.cell.genes;

    var x = entity.x;
    var y = entity.y;
    var r = genes.bodySize.value;
    var startPoint = nsGene.transformRotate(x, y, r, 0, entity.angle);
    var startAngle = 90 + (360 / genes.membraneRoughness.value / 2);

    var membrane = genes.membranePolar.value;

    genes.membraneXY.value = [];
    var membraneXY = genes.membraneXY.value;

    membraneXY.push({
        x: startPoint.x,
        y: startPoint.y
    });

    for (var s = 0; s < membrane.length - 1; s++) {
        startPoint = nsGene.transformRotate(startPoint.x, startPoint.y, membrane[s].length, 0, startAngle + (s != 0 ? (s * membrane[s].angleDeg) : 0));
        membraneXY.push({
            x: startPoint.x,
            y: startPoint.y
        });
    }
};


nsGene.Cell.prototype.process2 = function (entity) {
    var genes = entity.cell.genes;

    var x = entity.x;
    var y = entity.y;
    var r = genes.bodySize.value;
    var startPoint = nsGene.transformRotate(x, y, r, 0, entity.angle);
    var startAngle = 90 + (360 / genes.membraneRoughness.value / 2);

    var membrane = genes.membranePolar.value;
    var angleDeg = 360 / membrane.length;
    var perfectLength = 2 * r * Math.sin(nsGene.toRadians(angleDeg / 2));


    // process membrane
    for (var s = 0; s < membrane.length - 1; s++) {
        var segment = membrane[s];
        var a = segment.angleDeg;
        var l = segment.length;

        var lengthDiff = (perfectLength - l) / nsGene.randomRange(30, 50);
        lengthDiff = Math.abs(lengthDiff) < .0001 ? .0001 : lengthDiff;

        var angleDiff = (angleDeg - a) / nsGene.randomRange(100, 200);
        angleDiff = Math.abs(angleDiff) < .0001 ? .0001 : angleDiff;

        if (s == 0)
            startPoint = nsGene.transformRotate(startPoint.x, startPoint.y, l + lengthDiff, 0, startAngle);
        else
            startPoint = nsGene.transformRotate(startPoint.x, startPoint.y, l + lengthDiff, 0, startAngle + (s * a + angleDiff));

        segment.angleDeg = a + angleDiff;
        segment.length = l + lengthDiff;
    }
};


