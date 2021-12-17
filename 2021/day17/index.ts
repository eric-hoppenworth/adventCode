import data from './input.ts'
import testData from './test.ts'

type Vector = {
    row: number
    col: number
}
type Square = {
    topLeft: Vector
    bottomRight: Vector
}

const parseInput = (input: string): Square => {
    const matches = data.match(/x=(-?\d*)..(-?\d*), y=(-?\d*)..(-?\d*)/) || []
    return {
        topLeft: {
            row: parseInt(matches[4], 10),
            col: parseInt(matches[1], 10),
        },
        bottomRight:{
            row: parseInt(matches[3], 10),
            col: parseInt(matches[2], 10),
        }
    }
}

const partOne = (target: Square): number => {
    // constant gravity means that what comes up, must come down to the same altitude
    // this means that the best height is achieved when we just barely hit the lowest point of the target
    const minimum = Math.abs(target.bottomRight.row)
    return (minimum * (minimum - 1)) / 2
}

console.log(partOne(parseInput(testData)))
// console.log(partOne(parseInput(testData)))