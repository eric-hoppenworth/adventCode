import data from './input.ts'
import testData from './test.ts'

type Location = {
    row: number;
    col: number;
}
type Direction = 'N' | 'S' | 'E' | 'W'
type Pipe = {
    location: Location;
    connections: Direction[];
}
type Grid = Pipe[][]
type Puzzle = {
    grid: Grid;
    start: Location;
}
const directionMap: Record<Direction, Direction> = {
    'E': 'W',
    'W': 'E',
    'S': 'N',
    'N': 'S',
}
const getLocationInDirection = (loc: Location, direction: string): Location => {
    switch(direction) {
        case 'N':
            return { row: loc.row - 1, col: loc.col + 0 }
        case 'E':
            return { row: loc.row + 0, col: loc.col + 1 }
        case 'S':
            return { row: loc.row + 1, col: loc.col + 0 }
        case 'W':
            return { row: loc.row + 0, col: loc.col - 1 }
    }
    return { ...loc }
}
const parseInput = (input: string): Puzzle  => {
    let start = { row: 0, col: 0 }
    const grid = input.split('\n').map((a, row) => {
        return a.split('').map((tile, col) => {
            const location = { row, col }
            const connections: Direction[] = []
            if (tile === 'S') {
                start.row = row
                start.col = col
            }
            switch (tile) {
                case '|':
                    connections.push('N', 'S')
                    break
                case '-':
                    connections.push('E', 'W')
                    break
                case 'L':
                    connections.push('N', 'E')
                    break
                case 'F':
                    connections.push('E', 'S')
                    break
                case '7':
                    connections.push('S', 'W')
                    break
                case 'J':
                    connections.push('N', 'W')
                    break
                case 'S':
                    start = location
                    connections.push('N', 'E', 'S', 'W')
                    break
            }
            return { location, connections}
        })
    })
    return { grid, start }
}
const moveToNextPipe = (grid: Grid, pipe: Pipe): Pipe => {
    for (const direction of pipe.connections) {
        const oppositeDirection = directionMap[direction]
        const nextLocation = getLocationInDirection(pipe.location, direction)
        const nextPipe = grid[nextLocation.row][nextLocation.col]
        if (nextPipe?.connections.includes(oppositeDirection)) {
            return {
                location: nextLocation,
                connections: [nextPipe.connections.filter(a => a !== oppositeDirection)[0]]
            }
        }
    }
    return pipe
}

const getPath = (puzzle: Puzzle): Pipe[] => {
    let pipe = puzzle.grid[puzzle.start.row][puzzle.start.col]
    if (!pipe) {
        throw new Error()
    }
    const steps = []
    while (true) {
        pipe = moveToNextPipe(puzzle.grid, pipe)
        steps.push(pipe)
        if (pipe.location.row === puzzle.start.row && pipe.location.col === puzzle.start.col) {
            return steps
        }
    }
}

const partOne = (input: string): number => {
    return getPath(parseInput(input)).length / 2

}
const partTwo = (input: string): number => {
    const puzzle = parseInput(input)
    const path = getPath(puzzle)
    const grid: string[][] = puzzle.grid.map(a => a.map(b => '.'))
    path.forEach(pipe => {
        grid[pipe.location.row][pipe.location.col] = " "
    })
    console.log(grid.map(a => a.join('')).join('\n'))
    return 0
}

// console.log(partOne(data))
console.log(partTwo(data))