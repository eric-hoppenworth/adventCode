const fs = require('fs');
const xBounds = {
    min: 0,
    max: 4
};
const yBounds = {
    min: 0,
    max: 4
};


function Location() {
    this.grid = [
        ['-','-','D','-','-'],
        ['-','A','B','C','-'],
        ['5','6','7','8','9'],
        ['-','2','3','4','-'],
        ['-','-','1','-','-']
    ];
    this.coord = {
        x: 0,
        y: 2
    };
    this.directionVectors = {
        U: {
            x:0,
            y:1
        },
        D: {
            x:0,
            y:-1
        },
        L: {
            x:-1,
            y:0
        },
        R: {
            x:1,
            y:0
        }
    };
}

Location.prototype.move = function(dir) {
    let newVect = combineVectors(this.coord, this.directionVectors[dir]);
    if (this.grid[newVect.y][newVect.x] === '-') {
        //do not move
    } else {
        this.coord = newVect;
    }
    return this.coord;
}
Location.prototype.getCode = function (){
    return this.grid[this.coord.y][this.coord.x];
}

const combineVectors = (vec1, vec2) => {
    return checkBounds({
        x: vec1.x + vec2.x,
        y: vec1.y + vec2.y
    });
};

const checkBounds = (vect) => {
    return {
        x: vect.x > xBounds.max ? xBounds.max : (vect.x < xBounds.min ? xBounds.min : vect.x),
        y: vect.y > yBounds.max ? yBounds.max : (vect.y < yBounds.min ? yBounds.min : vect.y)
    }
}


fs.readFile('./puzzle.txt','utf8',function(err, data){
    const list = data.split('\n');
    const location = new Location();
    list.forEach(function(item){
        for (var i = 0; i < item.length; i++) {
            location.move(item[i]);
        }
        console.log(location.getCode());
    });
    //
    // let item = list[0];
    // for (var i = 0; i < item.length; i++) {
    //     location.move(item[i]);
    //     console.log(location.getCode());
    // }
});
