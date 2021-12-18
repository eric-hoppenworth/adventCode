import data from './input.ts'
import testData from './test.ts'


type Target = {
    x: Range
    y: Range
}
type Range = {
    min: number
    max: number
}
type Point = {
    value: number
    range: Range
}

const parseInput = (input: string): Target => {
    const matches = input.match(/x=(-?\d*)..(-?\d*), y=(-?\d*)..(-?\d*)/) || []
    return {
        x: {
            min: parseInt(matches[1], 10),
            max: parseInt(matches[2], 10),
        },
        y: {
            min: parseInt(matches[3], 10),
            max: parseInt(matches[4], 10),
        }
    }
}

const partOne = (target: Target): number => {
    // constant gravity means that what comes up, must come down to the same altitude
    // this means that the best height is achieved when we just barely hit the lowest point of the target
    const minimum = Math.abs(target.y.min)
    return (minimum * (minimum - 1)) / 2
}
//
// pos = 0
// velocity = 0
// a = -1
//
// step 1 => 0, -1,
// step 2 => -1, -2,
// setp 3 => -3, -3,
// step 4 => -6, -4
// step 5 => -10, -5
const getRowStepCount = (row: number, range: Range): Range => {
    const a = -1
    let v = row
    let position = 0
    let minSteps = 0
    let steps = 0
    let maxSteps = 0

    while (position >= range.min) {
        maxSteps = steps
        position = position + v
        v = v + a

        steps++
        if (position <= range.max && !minSteps) {
            minSteps = steps
        }
    }
    return {
        min: minSteps,
        max: maxSteps,
    }
}
const getColStepCount = (col: number, range: Range): Range => {
    let velocity = col
    let position = 0
    let steps = 0
    let minSteps = 0
    let maxSteps = 0
    while (position <= range.max) {
        maxSteps = steps
        position = position + velocity
        velocity = velocity - 1
        steps++
        if (position >= range.min && !minSteps) {
            minSteps = steps
        }
        if (velocity <= 0) {
            maxSteps = Infinity
            break
        }
    }
    return {
        min: minSteps,
        max: maxSteps,
    }
}

const partTwo = (target: Target): number => {
    const rows: Point[] = []
    for(let i = target.y.min; i < Math.abs(target.y.min); i++) {
        const range = getRowStepCount(i, target.y)
        if (range.min > range.max || range.min === 0) {
            continue
        }
        rows.push({
            value: i,
            range,
        })
    }
    const cols: Point[] = []
    for (let i = 1; i <= target.x.max; i ++) {
        if (i*(i+1)/2 < target.x.min) {
            continue
        }
        const range = getColStepCount(i, target.x)
        if (range.min > range.max || range.min === 0) {
            continue
        }
        cols.push({
            value: i,
            range,
        })
    }
    let count = 0
    rows.forEach(row => console.log(row))
    console.log(cols)
    // since columns can have Infinity, I want to loop over my rows instead
    for (const yPoint of rows) {
        // find the number of xPoints that have the "same" step count
        // yMin is higher than or equal to xMin AND yMin is less than or equal to xMax
        for (const xPoint of cols) {
            if (yPoint.range.min >= xPoint.range.min && yPoint.range.min <= xPoint.range.max) {
                count++
            } else if (yPoint.range.max >= xPoint.range.min && yPoint.range.max <= xPoint.range.max) {
                count++
            }
        }
    }
    return count
}
// console.log(partOne(parseInput(data)))
console.log(partTwo(parseInput(data)))

// console.log(getColStepCount(19, { min: 20, max: 30 }))