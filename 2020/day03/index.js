const fs = require('fs')
fs.readFile('./puzzle.txt', 'utf8', function(err, data) {
    data = data.split(require('os').EOL).map(item => item.split(''));
    // console.log(partOne(data));
    console.log(partTwo(data));
});

function partOne(data) {
    return checkSlope(data, {
        x: 3,
        y: 1
    })
}

function partTwo(data) {
    const slopes = [{
        x: 1,
        y: 1
    },{
        x: 3,
        y: 1
    },{
        x: 5,
        y: 1
    },{
        x: 7,
        y: 1
    },{
        x: 1,
        y: 2
    }];
    return slopes.reduce((carry, slope)=>{
        return carry * checkSlope(data, slope)
    }, 1)
}


function checkSlope(map, velocity) {
    const TREE = '#'
    let position = {
        x: 0,
        y: 0
    }
    let treeCount = 0
    while (position.y <= map.length - 1) {
        if (map[position.y][position.x] === TREE) {
            treeCount++
        }
        position.x = (position.x + velocity.x) % map[position.y].length
        position.y = position.y + velocity.y
    }

    return treeCount
}