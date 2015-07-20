/**
 * Created on 2015-07-10.
 */

window.nsGene = window.nsGene || {};

nsGene.init = (function () {

    nsGene.world = new nsGene.World();

    var i;
    var x;
    var y;
    var e;

    for (i = 0; i < nsGene.config.entityInitialCount; i++) {

        e = {
            cell     : new nsGene.Cell(),
            x        : nsGene.config.canvasSizeX / 2 + nsGene.randomRange(-70, 50),
            y        : nsGene.config.canvasSizeY / 2 + nsGene.randomRange(-50, 70),
            //x        : Math.floor((nsGene.random() * nsGene.config.canvasSizeX)),
            //y        : Math.floor((nsGene.random() * nsGene.config.canvasSizeY)),
            //angle    : Math.floor((nsGene.random() * 360)),
            //direction: Math.floor((nsGene.random() * 360)),
            angle    : 0,
            direction: 0,
            //velocity : Math.floor((nsGene.random() * 5))
            velocity : 0
        };
        // horizontal
        if (e.x < e.cell.genes.bodysize.value + 2)
            e.x = e.cell.genes.bodysize.value + 2;
        else if (e.x > nsGene.config.canvasSizeX - e.cell.genes.bodysize.value - 2)
            e.x = nsGene.config.canvasSizeX - e.cell.genes.bodysize.value - 2;

        // vertical
        if (e.y < e.cell.genes.bodysize.value + 2)
            e.y = e.cell.genes.bodysize.value + 2;
        else if (e.y > nsGene.config.canvasSizeX - e.cell.genes.bodysize.value - 2)
            e.y = nsGene.config.canvasSizeX - e.cell.genes.bodysize.value - 2;

        nsGene.world.entities.push(e);
    }

    //var c = {
    //    cell     : new nsGene.Cell(),
    //    x        : nsGene.config.canvasSizeX / 2 + nsGene.randomRange(-50, 50),
    //    y        : nsGene.config.canvasSizeY / 2 + nsGene.randomRange(-50, 50),
    //    angle    : Math.floor((nsGene.random() * 360)),
    //    direction: Math.floor((nsGene.random() * 360)),
    //    //velocity : Math.floor((nsGene.random() * 5))
    //    velocity : 0
    //};
    //c.cell.genes.bodysize.value = 75;
    //c.cell.genes.bodycolor.value = [200, 200, 255];
    //c.cell.genes.membranecolor.value = [120, 50, 50];
    //nsGene.world.entities.push(c);

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
