const fs = require('fs');

function Character (){
    this.direction = 0;
    this.directions = [
        'north',
        'east',
        'south',
        'west'
    ];
    this.displacement = {
        north: 0,
        east: 0,
        south: 0,
        west: 0
    };
    this.visited = [{
        x:0,
        y:0
    }];
}

Character.prototype.turn = function (dir) {
    let currentPos = this.direction;
    if (dir === 'L') {
        currentPos--;
    } else if (dir === 'R') {
        currentPos++;
    }

    if (currentPos < 0) {
        currentPos += this.directions.length;
    } else if (currentPos >= this.directions.length) {
        currentPos -= this.directions.length;
    }
    this.direction = currentPos;
};

Character.prototype.getDirection = function(){
    return this.directions[this.direction];
};

Character.prototype.moveForward = function (step) {
    for (var i = 0; i < step; i++){
        this.displacement[this.getDirection()]++;
        this.checkCoords();
    }
};

Character.prototype.doMove = function (command) {
    let direction = command[0];
    let step = parseInt(command.substring(1),10);
    this.turn(direction);
    this.moveForward(step);
};

Character.prototype.reduceDisplacement = function () {
    let yTotal = Math.abs(this.displacement.north - this.displacement.south);
    let xTotal = Math.abs(this.displacement.east - this.displacement.west);
    return xTotal + yTotal;
}

Character.prototype.getCoordinates = function () {
    return {
        x: this.displacement.east - this.displacement.west,
        y: this.displacement.north - this.displacement.south
    };
}
Character.prototype.checkCoords = function () {
    let myCoord = this.getCoordinates();
    let me = this;
    this.visited.forEach(function(coords){
        if (coords.x == myCoord.x && coords.y == myCoord.y) {
            console.log('found one: '+ me.reduceDisplacement());
        }
    });
    this.visited.push(myCoord);
}



fs.readFile('./input.txt','utf8',function(err, data){
    const commands = data.split(", ");
    const myUnit = new Character();
    commands.forEach(function(command){
        myUnit.doMove(command);
    });
    console.log(myUnit.reduceDisplacement());
});
