/**
 * Created on 2015-07-10.
 */

window.nsGene = window.nsGene || {};

nsGene.init = (function () {

    nsGene.world = new nsGene.World();

    for (var i = 1; i <= nsGene.config.entityInitialCount; i++) {
        nsGene.world.entities[i] = {
            cell     : new nsGene.Cell(),
            x        : nsGene.config.canvasSizeX / 2 + nsGene.randomRange(-50, 50),
            y        : nsGene.config.canvasSizeY / 2 + nsGene.randomRange(-50, 50),
            //x        : Math.floor((nsGene.random() * nsGene.config.canvasSizeX / 10)) + nsGene.config.canvasSizeX / 2,
            //y        : Math.floor((nsGene.random() * nsGene.config.canvasSizeY / 10)) + nsGene.config.canvasSizeY / 2,
            angle    : Math.floor((nsGene.random() * 360)),
            direction: Math.floor((nsGene.random() * 360)),
            velocity : Math.floor((nsGene.random() * 5))
        };
    }

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
