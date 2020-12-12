const fs = require('fs')

const EMPTY = 'L'
const FLOOR = '.'
const FILLED = '#'

fs.readFile('./puzzle.txt', 'utf8', function(err, data) {
    data = data
        .split(require('os').EOL)
        .map(item => item.split(''))

    // console.log(partOne(data));
    console.log(partTwo(data));
});

function stepOne(map) {
    function countAdjacent(map, location) {
        let counter = 0
        for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
            for (let colOffset = -1; colOffset <= 1; colOffset++) {
                if (rowOffset === 0 && colOffset === 0) {
                    continue
                }
                if (
                    map[location.row + rowOffset] &&
                    map[location.row + rowOffset][location.col + colOffset] &&
                    map[location.row + rowOffset][location.col + colOffset] === FILLED
                ) {
                    counter++
                }
            }
        }
        return counter
    }
    return map.map((row, i) => {
        return row.map((seat, j) => {
            if (seat === FLOOR) {
                return FLOOR
            }
            let count = countAdjacent(map, {
                row: i,
                col: j
            })
            if (count === 0 && seat === EMPTY) {
                return FILLED
            } else if (count >= 4 && seat === FILLED) {
                return EMPTY
            } else {
                return seat
            }
        })
    })
}
function stepTwo(map) {
    function countAdjacent(map, location) {
        let counter = 0
        const directions = [{
            row: -1,
            col: -1
        },{
            row: -1,
            col: 0
        },{
            row: -1,
            col: 1
        },{
            row: 0,
            col: -1
        },{
            row: 0,
            col: 1
        },{
            row: 1,
            col: -1
        },{
            row: 1,
            col: 0
        },{
            row: 1,
            col: 1
        }]
        directions.forEach(direction => {
            let row = location.row
            let col = location.col
            while(true) {
                row = row + direction.row
                col = col + direction.col
                if (!map[row] || !map[row][col]) {
                    break;
                }
                if (map[row][col] === EMPTY) {
                    break;
                } else if (map[row][col] === FILLED) {
                    counter++;
                    break;
                }
            }
        })
        return counter
    }
    return map.map((row, i) => {
        return row.map((seat, j) => {
            if (seat === FLOOR) {
                return FLOOR
            }
            let count = countAdjacent(map, {
                row: i,
                col: j
            })
            if (count === 0 && seat === EMPTY) {
                return FILLED
            } else if (count >= 5 && seat === FILLED) {
                return EMPTY
            } else {
                return seat
            }
        })
    })
}

function partOne(map) {
    const turns = [map]

    while (!checkSame(turns[turns.length - 1], turns[turns.length - 2])) {
        turns.push(stepOne(turns[turns.length - 1]))
    }
    return countFilled(turns[turns.length - 1])
}

function partTwo(map) {
    const turns = [map]

    while (!checkSame(turns[turns.length - 1], turns[turns.length - 2])) {
        turns.push(stepTwo(turns[turns.length - 1]))
    }
    return countFilled(turns[turns.length - 1])
}


function checkSame (a, b) {
    if (!a || !b) {
        return false
    }
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < a[i].length; j++) {
            if (a[i][j] !== b[i][j]) {
                return false
            }
        }
    }
    return true
}
function countFilled(map) {
    return map.reduce((carry, row) => carry + row.reduce((carry, seat) => carry + (seat === FILLED), 0), 0)
}
