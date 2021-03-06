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
        if (entity.x < entity.cell.genes.bodySize.value + 2)
            entity.x = entity.cell.genes.bodySize.value + 2;
        else if (entity.x > nsGene.config.canvasSizeX - entity.cell.genes.bodySize.value - 2)
            entity.x = nsGene.config.canvasSizeX - entity.cell.genes.bodySize.value - 2;

        // vertical
        if (entity.y < entity.cell.genes.bodySize.value + 2)
            entity.y = entity.cell.genes.bodySize.value + 2;
        else if (entity.y > nsGene.config.canvasSizeX - entity.cell.genes.bodySize.value - 2)
            entity.y = nsGene.config.canvasSizeX - entity.cell.genes.bodySize.value - 2;

        this.entities.push(entity);
    }

    // TEMP: cell 0 is large
    this.entities[0].cell.genes.bodySize.value = 50;
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
        entity.cell.genes.bodySize.value = 40;
        entity.cell.createMembranePolar(true);
        this.entities.push(entity);
    }

    if (count > 1) {
        entity = {
            cell     : new nsGene.Cell(),
            //x        : 330,
            //y        : 170,
            x        : 290,
            y        : 220,
            angle    : 0,
            direction: 0,
            velocity : 0,
            mass     : 1
        };
        entity.cell.createMembranePolar(true);
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
        entity.cell.createMembranePolar();
        this.entities.push(entity);
    }

    if (count > 3) {
        entity = {
            cell     : new nsGene.Cell(),
            x        : 330,
            y        : 300,
            angle    : 0,
            direction: 0,
            velocity : 0,
            mass     : 1
        };
        entity.cell.createMembranePolar();
        this.entities.push(entity);
    }
};


nsGene.World.prototype.createEntity = function () {
    var entity = {
        cell    : new nsGene.Cell(),
        x       : Math.floor((nsGene.random() * nsGene.config.canvasSizeX)),
        y       : Math.floor((nsGene.random() * nsGene.config.canvasSizeY)),
        angle   : Math.floor((nsGene.random() * 360)),
        velocity: 0, //Math.floor((nsGene.random() * 5)),
        mass    : 1
    };
    entity.cell.createMembranePolar(true);

    return entity;
};

nsGene.World.prototype.pump = function (entity, percent) {
    var x = entity.x;
    var y = entity.y;

    var genes = entity.cell.genes;

    genes.bodySize.value += (genes.bodySize.value * percent / 100);
};


nsGene.World.prototype.run = function () {
    if (arguments[0] == 1) nsGene.config.isRunning = true;
    if (!nsGene.config.isRunning) return;
    if (arguments[0] == 1) nsGene.config.isRunning = false;

    var entities = nsGene.world.entities;
    var entityA;
    var entityB;

    for (var eA = 0; eA < entities.length; eA++) {
        entityA = entities[eA];
        entityA.cell.process(entityA);

        for (var eB = 0; eB < entities.length; eB++) {
            if (eB == eA) continue;

            entityB = entities[eB];
            //entityB.cell.process(entityB);

            nsGene.World.prototype.intersect(entityA, entityB);
        }
    }

    nsGene.renderer.render(arguments[0]);
};


nsGene.World.prototype.intersect = function (entityA, entityB) {
    var membraneA = entityA.cell.genes.membraneXY.value;
    var membraneB = entityB.cell.genes.membraneXY.value;

    var vertexA1;
    var vertexA2;
    var vertexB1;
    var vertexB2;

    var cp;

    var newMembraneA = [];

    var undercover;

    for (var vA = 0; vA < membraneA.length; vA++) {
        vertexA1 = membraneA[vA];
        vertexA2 = vA < membraneA.length - 1 ? membraneA[vA + 1] : membraneA[0];

        undercover = nsGene.calcPointInPolygon(vertexA1.x, vertexA1.y, membraneB);
        if (!undercover)
            newMembraneA.push(vertexA1);

        for (var vB = 0; vB < membraneB.length; vB++) {
            vertexB1 = membraneB[vB];
            vertexB2 = vB < membraneB.length - 1 ? membraneB[vB + 1] : membraneB[0];

            if (nsGene.isCrossing(vertexA1, vertexA2, vertexB1, vertexB2)) {
                cp = {
                    x: ((vertexA2.x - vertexA1.x) * (vertexB2.x * vertexB1.y - vertexB2.y * vertexB1.x) - (vertexB2.x - vertexB1.x) * (vertexA2.x * vertexA1.y - vertexA2.y * vertexA1.x)) / ((vertexA2.y - vertexA1.y) * (vertexB2.x - vertexB1.x) - (vertexB2.y - vertexB1.y) * (vertexA2.x - vertexA1.x)),
                    y: ((vertexB2.y - vertexB1.y) * (vertexA2.x * vertexA1.y - vertexA2.y * vertexA1.x) - (vertexA2.y - vertexA1.y) * (vertexB2.x * vertexB1.y - vertexB2.y * vertexB1.x)) / ((vertexB2.y - vertexB1.y) * (vertexA2.x - vertexA1.x) - (vertexA2.y - vertexA1.y) * (vertexB2.x - vertexB1.x))
                };
                newMembraneA.push(cp);
                break;
            }
        }
    }

    entityA.cell.genes.membraneXY.value = newMembraneA;
};