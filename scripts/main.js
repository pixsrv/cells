/**
 * Created on 2015-07-10.
 */

window.nsGene = window.nsGene || {};

nsGene.init = (function () {

    nsGene.world = new nsGene.World();
    //nsGene.world.populate();
    nsGene.world.schemaPopulate(4);

    nsGene.renderer = new nsGene.Renderer();

    nsGene.world.run(1);
})();


nsGene.start = function () {
    nsGene.config.isRunning = !nsGene.config.isRunning;
    nsGene.world.run();
    nsGene.renderer.render();
};

nsGene.step = function () {
    nsGene.world.run(1);
};

nsGene.clear = function () {
    nsGene.world.entities = [];
    nsGene.renderer.render(1);
};

nsGene.pumpUp = function () {
    var w = nsGene.world;
    w.pump(w.entities[0], 10);
    nsGene.renderer.render(1);
};

nsGene.pumpDown = function () {
    var w = nsGene.world;
    w.pump(w.entities[0], -10);
    nsGene.renderer.render(1);
};
