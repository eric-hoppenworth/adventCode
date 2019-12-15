const fs = require("fs");

const directions = {
    U: {
        x: 0,
        y: 1
    },
    D : {
        x:0,
        y:-1
    },
    R : {
        x:1,
        y:0
    },
    L : {
        x:-1,
        y:0
    }
}

function Wire (commands, id) {
    this.commands = commands;
    this.id = id;
    this.origin = {
        x:0,
        y:0
    };
    this.positions = [this.origin];
}
Wire.prototype.move = function (command) {
    const direction = command.substring(0,1);
    const count = parseInt(command.substring(1), 10);
    const directionVector = directions[direction];

    for(let i = 0; i < count ; i++) {
        let positionVector = this.positions[this.positions.length-1];
        this.positions.push({
            x: positionVector.x + directionVector.x,
            y: positionVector.y + directionVector.y
        });
    }

}

fs.readFile("./puzzle.txt","utf8",function(err,data){

    data = data.split(require('os').EOL);
    const wires = [];
    data.forEach(function(path, index){
        wires.push(new Wire(path.split(','), index));
    });

    wires.forEach(function(wire){
        wire.commands.forEach(function(command){
            wire.move(command);
        });
    });

    const overlaps = [];
    const map = {};
    wires.forEach(function(wire){
        wire.positions.forEach(function(vector, index){
            if (!map[vector.x]) {
                map[vector.x] = {};
            }
            if (!map[vector.x][vector.y]) {
                map[vector.x][vector.y] = {
                    ids : [],
                    stepCount : {}
                };
            }
            if (!map[vector.x][vector.y].ids.includes(wire.id)) {
                map[vector.x][vector.y].ids.push(wire.id);
                map[vector.x][vector.y].stepCount[wire.id] = index;
            }
            if (map[vector.x][vector.y].ids.length == 2) {
                overlaps.push(map[vector.x][vector.y]);
            }
        });
    });
    console.log(overlaps);
    console.log(overlaps[1].stepCount[0] + overlaps[1].stepCount[1]);
    console.log(overlaps[2].stepCount[0] + overlaps[2].stepCount[1]);
    // first I need to find the 'first' intersection.
    // this is trivial, since already know

});