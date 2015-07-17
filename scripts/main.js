/**
 * Created on 2015-07-10.
 */

window.nsGene = window.nsGene || {};

nsGene.init = (function () {

    nsGene.world = new nsGene.World();

    for (var i = 1; i <= nsGene.config.entityInitialCount; i++) {
        nsGene.world.entities[i] = {
            entity  : new nsGene.Entity(),
            x       : Math.floor((nsGene.random() * nsGene.config.canvasSizeX)),
            y       : Math.floor((nsGene.random() * nsGene.config.canvasSizeY)),
            angle   : Math.floor((nsGene.random() * 360)),
            velocity: Math.floor((nsGene.random() * 5))
        };
    }

    nsGene.world.go(1);
})();
