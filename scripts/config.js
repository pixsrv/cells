/**
 * Created on 2015-07-23.
 */

window.nsGene = window.nsGene || {};

nsGene.config = {
    isRunning: true,

    seed: 789,

    canvasSizeX: 700,
    canvasSizeY: 700,

    //entityInitialCount: 180,
    //entityInitialCount: 66,
    //entityInitialCount: 2,
    //entityInitialCount: 4,
    //entityInitialCount: 5,
    entityInitialCount: 12,

    entityMinCount: 0,
    entityMaxCount: 2500,
    entityMoveStep: 1,

    viscosity: .1, // TODO: rename to growth medium viscosity

    turnMaxCount: -1,

    drawLink   : true,
    drawForces : true,
    drawTensors: false,

    drawIDs     : true,
    drawVertexes: false
};
