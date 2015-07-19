/**
 * Created on 2015-07-10.
 */

window.nsGene = window.nsGene || {};

nsGene.init = (function () {

    nsGene.world = new nsGene.World();

    for (var i = 1; i <= nsGene.config.entityInitialCount; i++) {
        nsGene.world.entities[i] = {
            cell     : new nsGene.Cell(),
            x        : Math.floor((nsGene.random() * nsGene.config.canvasSizeX)),
            y        : Math.floor((nsGene.random() * nsGene.config.canvasSizeY/2)),
            angle    : Math.floor((nsGene.random() * 360)),
            direction: Math.floor((nsGene.random() * 360)),
            velocity : Math.floor((nsGene.random() * 5))
        };
    }

    //nsGene.world.entities[1] = {
    //    cell     : new nsGene.Cell(),
    //    x        : 170,
    //    y        : 170,
    //    angle    : 0,
    //    direction: 0,
    //    velocity : 30
    //};
    //nsGene.world.entities[2] = {
    //    cell     : new nsGene.Cell(),
    //    x        : 200,
    //    y        : 300,
    //    angle    : 0,
    //    direction: 0,
    //    velocity : 30
    //};

    nsGene.world.go(1);
})();


nsGene.start = function () {
    nsGene.config.isRunning = true;
    nsGene.world.go();
};

//nsGene.stop = function(){
//    nsGene.config.isRunning = false;
//};

nsGene.step = function () {
    nsGene.world.go(1);
};
