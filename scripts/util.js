/**
 * Created by pixel on 18.11.13.
 */

window.nsGene = window.nsGene || {};

nsGene.random = function Random() {
    var x = Math.sin(nsGene.seed++) * 10000;
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

nsGene.quarter = function (x1, y1, x2, y2) {
    if (x1 < x2) {
        if (y1 < y2) return 1;
        return 4;
    } else {
        if (y1 < y2) return 2;
        return 3;
    }
};

nsGene.transformRotate = function (cx, cy, x, y, angle) {
    var radians = nsGene.toRadians(angle),
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        xt = (cos * (x)) - (sin * (y)) + cx,
        yt = (cos * (y)) + (sin * (x)) + cy;
    return {x: xt, y: yt};
};

nsGene.transformTranslate = function (cx, cy, dx, dy) {
    return {x: cx + dx, y: cy + dy};
};

nsGene.calcInteraction = function (eA, eB) {
    var distance = parseInt(Math.sqrt((eA.x - eB.x) * (eA.x - eB.x) + (eA.y - eB.y) * (eA.y - eB.y)));
    var dy = eB.y - eA.y;
    var sin = dy / distance;
    sin = sin < -1 ? -1 : sin > 1 ? 1 : sin;
    var angle = -Math.asin(sin);

    return {
        distance: distance,
        angle   : angle
    }
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
nsGene.toDegrees = function (angle) {
    return angle * (180 / Math.PI);
};
nsGene.toRadians = function (angle) {
    return angle * (Math.PI / 180);
};