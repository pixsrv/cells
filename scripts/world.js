/**
 * Created by pixel on 14.11.13.
 */


window.nsGene = window.nsGene || {};


nsGene.World = function World() {
    this.entities = [];
};


nsGene.World.prototype.populate = function () {

    for (var e = 0; e < nsGene.config.entityInitialCount; e++) {
        var entity = this.createEntity();

        // verify position

        // horizontal
        if (entity.x < entity.cell.genes.bodysize.value + 2)
            entity.x = entity.cell.genes.bodysize.value + 2;
        else if (entity.x > nsGene.config.canvasSizeX - entity.cell.genes.bodysize.value - 2)
            entity.x = nsGene.config.canvasSizeX - entity.cell.genes.bodysize.value - 2;

        // vertical
        if (entity.y < entity.cell.genes.bodysize.value + 2)
            entity.y = entity.cell.genes.bodysize.value + 2;
        else if (entity.y > nsGene.config.canvasSizeX - entity.cell.genes.bodysize.value - 2)
            entity.y = nsGene.config.canvasSizeX - entity.cell.genes.bodysize.value - 2;

        this.entities.push(entity);
    }
};


nsGene.World.prototype.schemaPopulate = function (count) {
    var entity;

    if (count > 0) {
        entity = {
            cell    : new nsGene.Cell(),
            x       : 250,
            y       : 250,
            angle   : 0,
            velocity: 0,
            mass    : 1
        };
        entity.cell.createMembrane();
        this.entities.push(entity);
    }
    if (count > 1) {
        entity = {
            cell     : new nsGene.Cell(),
            x        : 330,
            y        : 170,
            angle    : 0,
            direction: 0,
            velocity : 0,
            mass     : 1
        };
        entity.cell.createMembrane();
        this.entities.push(entity);
    }
    if (count > 2) {

        entity = {
            cell     : new nsGene.Cell(),
            x        : 170,
            y        : 330,
            angle    : 0,
            direction: 0,
            velocity : 0,
            mass     : 1
        };
        entity.cell.createMembrane();
        this.entities.push(entity);
    }
    if (count > 3) {

        entity = {
            cell     : new nsGene.Cell(),
            x        : 330,
            y        : 330,
            angle    : 0,
            direction: 0,
            velocity : 0,
            mass     : 1
        };
        entity.cell.createMembrane();
        this.entities.push(entity);
    }
};


nsGene.World.prototype.createEntity = function () {
    var entity = {
        cell    : new nsGene.Cell(),
        x       : Math.floor((nsGene.random() * nsGene.config.canvasSizeX)),
        y       : Math.floor((nsGene.random() * nsGene.config.canvasSizeY)),
        //x        : nsGene.config.canvasSizeX / 2 + nsGene.randomRange(-70, 50),
        //y        : nsGene.config.canvasSizeY / 2 + nsGene.randomRange(-50, 70),
        angle   : Math.floor((nsGene.random() * 360)),
        velocity: 0, //Math.floor((nsGene.random() * 5)),
        mass    : 1
    };
    entity.cell.createMembrane();

    return entity;
};

nsGene.World.prototype.pump = function (entity, percent) {
    var x = entity.x;
    var y = entity.y;

    var genes = entity.cell.genes;

    genes.bodysize.value += (genes.bodysize.value * percent / 100);

};


nsGene.World.prototype.run = function () {
    if (arguments[0] == 1) nsGene.config.isRunning = true;
    if (!nsGene.config.isRunning) return;
    if (arguments[0] == 1) nsGene.config.isRunning = false;

    var entities = nsGene.world.entities;
    for (var e = 0; e < entities.length; e++) {
        var entity = entities[e];
        entity.cell.process(entity);
    }

    nsGene.renderer.render(arguments[0]);
};