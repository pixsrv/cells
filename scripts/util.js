/**
 * Created by pixel on 18.11.13.
 */

window.nsGene = window.nsGene || {};

/**
 * @return {number}
 */
nsGene.random = function Random() {
    var x = Math.sin(++nsGene.config.seed) * 10000;
    return x - Math.floor(x);
};

nsGene.randomRange = function (min, max) {
//	nsGene.random() * (max - min) + min;
    return Math.floor((nsGene.random() * (max - min + 1)) + min);
};

nsGene.randomPercent = function (percent) {
    return nsGene.randomRange(1, 100) <= percent;
};

nsGene.randomPermil = function (permil) {
    return nsGene.randomRange(1, 1000) <= permil;
};

nsGene.rgb2hex = function (r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return "#" + (256 + r).toString(16).substr(1) + ((1 << 16) + (g << 8) | b).toString(16).substr(1);
};

nsGene.rgba2hex = function (r, g, b, a) {
    if (r > 255 || g > 255 || b > 255 || a > 255)
        throw "Invalid color component";
    return "#" + (256 + r).toString(16).substr(1) + ((1 << 24) + (g << 16) | (b << 8) | a).toString(16).substr(1);
};

nsGene.colorGene2hex = function (gene) {
    return nsGene.rgb2hex(gene.value[0], gene.value[1], gene.value[2]);
};

nsGene.colorGene2hex2 = function (gene) {
    return "rgba(" + gene.value[0] + "," + gene.value[1] + "," + gene.value[2] + "," + ".7" + ")";
};

nsGene.transformRotate = function (cx, cy, x, y, angleDeg) {
    //var angleRad = angleDeg,
    var angleRad = nsGene.toRadians(angleDeg);
    var cos = Math.cos(angleRad);
    var sin = Math.sin(angleRad);
    var xt = (cos * (x)) - (sin * (y)) + cx;
    var yt = (sin * (x)) + (cos * (y)) + cy;
    return {x: xt, y: yt};
};

nsGene.transformTranslate = function (cx, cy, dx, dy) {
    return {x: cx + dx, y: cy + dy};
};

nsGene.calcInteraction = function (eA, eB) {
    var distance = Math.sqrt((eA.x - eB.x) * (eA.x - eB.x) + (eA.y - eB.y) * (eA.y - eB.y));
    var angleRad = Math.atan2(eA.y - eB.y, eA.x - eB.x);

    return {
        distance : distance,
        direction: angleRad
    }
};

nsGene.calcVectorSum = function (vectors, cx, cy) {
    var xy = vectors.map(function (v) {
        return {
            x: v.distance * Math.cos(v.direction),
            y: v.distance * Math.sin(v.direction)
        }
    });

    var sum = {
        x: xy.map(function (xy) {
            return xy.x
        }).reduce(function (a, b) {
            return a + b
        }),
        y: xy.map(function (xy) {
            return xy.y
        }).reduce(function (a, b) {
            return a + b
        })
    };

    return {
        distance : Math.max(50, Math.sqrt(sum.x * sum.x + sum.y * sum.y)),
        direction: Math.atan2(sum.y, sum.x)
    };
};

nsGene.toDegrees = function (angleRad) {
    return angleRad * (180 / Math.PI);
};

nsGene.toRadians = function (angleDeg) {
    return angleDeg * (Math.PI / 180);
};

nsGene.calcIntersection = function (r1, r2, dist) {
    var d1 = (-r1 * r1 + dist * dist + r2 * r2) / (2 * dist);
    var d2 = dist - d1;
    var a = Math.sqrt(r1 * r1 - d1 * d1);
    var alpha1 = Math.asin(a / r1);
    var alpha2 = Math.asin(a / r2);

    return {
        d1    : d1,
        d2    : d2,
        a     : a,
        alpha1: alpha1,
        alpha2: alpha2
    }
};

/**
 *
 * @param x x coordinate of tested point
 * @param y y coordinate of tested point
 * @param {Array} polygon array of xy pairs
 * @returns {boolean}
 */
nsGene.calcPointInPolygon = function (x, y, polygon) {
    var i = 0;
    var j = 0;
    var oddNODES = false;
    var polyX = polygon.map(function (p) {
        return p[0];
    });
    var polyY = polygon.map(function (p) {
        return p[1];
    });

    for (i = 0; i < polygon.length; i++) {
        j++;

        if (j == polygon.length)
            j = 0;

        if (polyY[i] < y && polyY[j] >= y || polyY[j] < y && polyY[i] >= y)
            if (polyX[i] + (y - polyY[i]) / (polyY[j] - polyY[i]) * (polyX[j] - polyX[i]) < x)
                oddNODES = !oddNODES;
    }

    return oddNODES;
};

nsGene.convertPolar2Cartesian = function (x, y, r, polar) {
    var pPoint = [];
    var cartesian = [];
    var cPoint = [];
    var np;

    for (var i = 0; i < polar.length; i++) {
        pPoint = polar[i];
        np = nsGene.transformRotate(x, y, r * pPoint[0], 0, pPoint[1]);
        cartesian.push([np.x, np.y]);
    }

    return cartesian;
};

nsGene.getQadrant = function (x1, y1, x2, y2) {
    if (x1 <= x2) {
        if (y1 <= y2) return 1;
        return 4;
    } else {
        if (y1 <= y2) return 2;
        return 3;
    }
};