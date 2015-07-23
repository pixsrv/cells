/**
 * Created on 2015-07-10.
 */

window.nsGene = window.nsGene || {};

nsGene.init = (function () {

    nsGene.world = new nsGene.World();
    //nsGene.world.populate();
    nsGene.world.schemaPopulate(1);

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
