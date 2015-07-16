/**
 * Created on 2015-07-10.
 */

window.nsGene = window.nsGene || { };

nsGene.init = (function(){

    nsGene.world = new nsGene.World();

    for(var i = 1; i <= nsGene.config.entityInitialCount; i++){
        var e = {};
        e["entity"] = new nsGene.Entity();
        e["x"] = Math.floor((nsGene.random() * nsGene.config.canvasSizeX));
        e["y"] = Math.floor((nsGene.random() * nsGene.config.canvasSizeY));

        nsGene.world.entities[i] = e;
    }

    nsGene.world.go(1);
})();
