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
     x        : Math.floor((nsGene.random() * nsGene.config.canvasSizeX)),
     y        : Math.floor((nsGene.random() * nsGene.config.canvasSizeY)),
     //x        : nsGene.config.canvasSizeX / 2 + nsGene.randomRange(-70, 50),
     //y        : nsGene.config.canvasSizeY / 2 + nsGene.randomRange(-50, 70),
     angle    : 0, //Math.floor((nsGene.random() * 360)),
     direction: 0, //Math.floor((nsGene.random() * 360)),
     velocity : 0, //Math.floor((nsGene.random() * 5)),
     mass     : 1
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

/*
    nsGene.world.entities.push({
        cell     : new nsGene.Cell(),
        x        : 170,
        y        : 170,
        angle    : 0,
        direction: 0,
        velocity : 0,
        mass     : 1
    });
    nsGene.world.entities.push({
        cell     : new nsGene.Cell(),
        x        : 330,
        y        : 170,
        angle    : 0,
        direction: 0,
        velocity : 0,
        mass     : 1
    });
    nsGene.world.entities.push({
        cell     : new nsGene.Cell(),
        x        : 170,
        y        : 330,
        angle    : 0,
        direction: 0,
        velocity : 0,
        mass     : 1
    });
    nsGene.world.entities.push({
        cell     : new nsGene.Cell(),
        x        : 330,
        y        : 330,
        angle    : 0,
        direction: 0,
        velocity : 0,
        mass     : 1
    });
*/

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
