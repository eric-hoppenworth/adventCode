import data from './input.ts'
import testData from './test.ts'


type SnailNumber = string

const parseInput = (input: string): SnailNumber[] => {
    return input.split('\n')
}

const getMagnitude = (snail: SnailNumber): number => {
    // something something
    while(snail[0] === '[') {
        const matches = snail.match(/\[(\d{1,}),(\d{1,})\]/)
        if (!matches) {
            return 0
        }
        const length = matches[0].length
        const value = (parseInt(matches[1], 10) * 3) + (parseInt(matches[2], 10) * 2)
        const index = matches.index || 0
        snail = `${snail.slice(0, index)}${value}${snail.slice(index + length)}`
    }
    return parseInt(snail, 10)
}

const explode = (snail: SnailNumber, index: number, match: string[]): SnailNumber => {
    let left = parseInt(match[0] || '0', 10)
    let right = parseInt(match[1] || '0', 10)
    const matchLength = match[0].length + match[1].length + 1
    // look backward (?) until I find a number
    // because of the way the rules work out, I can be sure the number is a single digit~~~~~OOPS
    let previousIndex = 0
    let previousLength = 0
    for (let i = index - 1; i >= 0; i--) {
        const isDigit = Boolean(snail[i].match(/\d/))
        if (isDigit) {
            previousIndex = i
            previousLength++
        }
        if (!isDigit && previousLength) {
            break;
        }
    }
    if (previousLength) {
        left += parseInt(snail.slice(previousIndex, previousIndex + previousLength), 10)
    }
    let nextIndex = 0
    let nextLength = 0
    // looking forward, it _could_ be a two digit number, so we'll use regex
    let nextMatch = snail.slice(index + matchLength).match(/\d{1,}/)
    if (nextMatch) {
        right += parseInt(nextMatch[0], 10)
        nextLength = nextMatch[0].length
        nextIndex = (nextMatch.index || 0) + index + matchLength
    }

    const front = previousLength ? `${snail.slice(0, previousIndex)}${left}${snail.slice(previousIndex + previousLength, index - 1)}` : snail.slice(0, index - 1)
    const end = nextLength ?
        `${snail.slice(index + matchLength + 1, nextIndex)}${right}${snail.slice(nextIndex + nextLength)}` :
        `${snail.slice(index + matchLength + 1)}`
    return `${front}0${end}`
}
const split = (snail: SnailNumber, index: number, match: string): SnailNumber => {
    const length = match.length
    const value = parseInt(match, 10)
    return `${snail.slice(0,index)}[${Math.floor(value/2)},${Math.ceil(value/2)}]${snail.slice(index + length)}`
}

const sumSnailNumbers = (left: SnailNumber, right: SnailNumber): SnailNumber => {
    let total: string = `[${left},${right}]`
    let action = true
    while(action) {
        action = false
        let depth = 0
        for (let i = 0; i < total.length; i++) {
            const character = total[i]
            if (character === '[') {
                depth++
                continue
            } else if (character === ']') {
                depth--
                continue
            }

            if (depth > 4) {
                const matches = total.slice(i).match(/^\d{1,},\d{1,}/)
                if (matches) {
                    total = explode(total, i, matches[0].split(','))
                    action = true
                    break
                }
            }
        }
        if (action) {
            continue
        }
        for (let i = 0; i < total.length; i++) {
            const matches = total.slice(i).match(/^\d{1,}/)
            if (matches && parseInt(matches[0], 10) >= 10) {
                total = split(total, i, matches[0])
                action = true
                break
            }
        }
    }
    return total
}

const partOne = (list: SnailNumber[]): number => {
    let sum = list[0]
    for (let i = 1; i < list.length; i++) {
        sum = sumSnailNumbers(sum, list[i])
    }
    return getMagnitude(sum)
}
const partTwo = (list: SnailNumber[]): number => {
    const magnitudes = []
    for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list.length; j++) {
            if (i === j) {
                continue
            }
            magnitudes.push(getMagnitude(sumSnailNumbers(list[i], list[j])))
        }
    }
    return Math.max(...magnitudes)
}
// console.log(partOne(parseInput(data)))
console.log(partTwo(parseInput(data)))
