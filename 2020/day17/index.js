const fs = require('fs')

const ACTIVE = '#'
const INACTIVE = '.'

function Puzzle(startingPositions, dimensions = 3) {
    this.cycles = 0
    this.dimensions = dimensions
    this.widths = {}
    function createCube(item) {
        return {
            0: item
        }
    }
    let cube = {}
    for (let y = 0; y < startingPositions.length; y++) {
        for (let x = 0; x < startingPositions[0].length; x++) {
            if (!cube[y]) {
                cube[y] = {}
            }
            cube[y][x] = startingPositions[y][x]
        }
        this.widths[dimensions] = startingPositions[0].length
    }
    this.widths[dimensions - 1] = startingPositions.length
    for (let i = 0; i < dimensions - 2; i++) {
        cube = createCube(cube)
        this.widths[dimensions - 2 - i] = 1
    }
    this.cube = cube
}
Puzzle.prototype.runCycle = function() {
    this.cycles = this.cycles + 1
    let total = 0
    const expandCube = (cube, dimension, coords = []) => {
        let row = {}
        for (let i = 0 - this.cycles; i < this.widths[dimension] + this.cycles; i++) {
            let item = cube[i]
            if (dimension < this.dimensions) {
                if (!item) {
                    row[i] = expandCube({}, dimension + 1, [...coords, i])
                } else {
                    row[i] = expandCube(item, dimension + 1, [...coords, i])
                }
            } else {
                let count = this.countActiveNeighbors([...coords, i])
                row[i] = INACTIVE
                if (count === 3) {
                    row[i] = ACTIVE
                    total++
                } else if (item === ACTIVE && count === 4) {
                    row[i] = ACTIVE
                    total++
                }
            }
        }
        return row
    }

    this.cube = expandCube(this.cube, 1, [])
    return total
}
Puzzle.prototype.countActiveNeighbors = function(coords) {
    let carry = 0
    const dig = (cube, coords) => {
        if (!coords.length) {
            carry += cube === ACTIVE ? 1 : 0
            return cube === ACTIVE ? 1 : 0
        }
        let key = coords.shift();
        return (
            (cube[key + 0] ? dig(cube[key + 0], [...coords]) : 0) +
            (cube[key - 1] ? dig(cube[key - 1], [...coords]) : 0) +
            (cube[key + 1] ? dig(cube[key + 1], [...coords]) : 0)
        )
    }
    return dig(this.cube, coords)
}

fs.readFile('./puzzle.txt', 'utf8', function(err, data) {
    data = data.split(require('os').EOL).map(item => item.split(''))

    // console.log(partOne(data))
    console.log(partTwo(data))
})

function partOne(data) {
    const puzzle = new Puzzle(data)
    // cycle
    let count = 0
    while(puzzle.cycles < 6) {
        count = puzzle.runCycle()
    }
    return count
}

function partTwo(data) {
    const puzzle = new Puzzle(data, 4)
    // cycle
    let count = 0
    while(puzzle.cycles < 6) {
        count = puzzle.runCycle()
    }
    return count
}
