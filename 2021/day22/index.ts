import data from './input.ts'
import testData from './test.ts'

type Range = {
    min: number
    max: number
}

type Vector = {
    x: number
    y: number
    z: number
}

type RangeVector = {
    x: Range
    y: Range
    z: Range
}

type Command = {
    value: 1 | 0
    range: RangeVector
}

const parseInput = (input: string): Command[] => {
    return input.split('\n').map((line: string): Command => {
        const [value, rest] = line.split(' ')
        const matches = rest.match(/^x=(.*)\.\.(.*),y=(.*)\.\.(.*),z=(.*)\.\.(.*)$/) || []
        return {
            value: value === 'on' ? 1 : 0,
            range: {
                x: {
                    min: parseInt(matches[1] ,10),
                    max: parseInt(matches[2] ,10),
                },
                y: {
                    min: parseInt(matches[3] ,10),
                    max: parseInt(matches[4] ,10),
                },
                z: {
                    min: parseInt(matches[5] ,10),
                    max: parseInt(matches[6] ,10),
                },
            }
        }
    })
}

const vectorIsInRange = (v: Vector, range: RangeVector): boolean => {
    if (v.x > range.x.max || v.x < range.x.min) {
        return false
    }
    if (v.y > range.y.max || v.y < range.y.min) {
        return false
    }
    if (v.z > range.z.max || v.z < range.z.min) {
        return false
    }
    return true
}

const getFirstCommand = (v: Vector, commandList: Command[]): Command | undefined => {
    return commandList.find((command) => vectorIsInRange(v, command.range))
}

const partOne = (commands: Command[]): number => {
    let total = 0
    commands.reverse()
    for (let x = -50; x <= 50; x++) {
        for (let y = -50; y <= 50; y++) {
            for (let z = -50; z <= 50; z++) {
                const command = getFirstCommand({ x, y, z }, commands)
                if (command && command.value) {
                    total++
                }
            }
        }
    }

    return total
}
const partTwo = (commands: Command[]): number => {
    let total = 0
    commands.reverse()
    for (let x = -100000; x <= 100000; x++) {
        for (let y = -100000; y <= 100000; y++) {
            for (let z = -100000; z <= 100000; z++) {
                const command = getFirstCommand({ x, y, z }, commands)
                if (command && command.value) {
                    total++
                }
            }
        }
        console.log(x)
    }

    return total
}

// console.log(partOne(parseInput(data)))
console.log(partTwo(parseInput(data)))
