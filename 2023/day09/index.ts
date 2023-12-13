import data from './input.ts'
import testData from './test.ts'

const isAllZero = (arr: number[]): boolean => arr.every(a => a === 0)
const findDifferences = (arr: number[]): number[] => {
    const diff: number[] = []
    for (let i = 0; i < arr.length - 1; i++) {
        diff.push(arr[i + 1] - arr[i])
    }
    return diff
}
const parseInput = (input: string): number[][] => {
    return input.split('\n').map((line): number[] => {
        return line.split(' ').map(a => parseInt(a, 10))
    })
}
const getDifferenceSets = (line: number[]): number[][] => {
    const differences: number[][] = [[...line]]
    while(true) {
        if (isAllZero(differences[differences.length - 1])) {
            return differences
        }
        differences.push(findDifferences(differences[differences.length - 1]))
    }
}
const extrapolateForward = (line: number[]): number => {
    return getDifferenceSets(line).reduce((carry: number, diff: number[]): number => carry + diff[diff.length - 1], 0)
}
const extrapolateBackward = (line: number[]): number => {
    return getDifferenceSets(line).reverse().reduce((carry: number, diff: number[]): number => diff[0] - carry, 0)
}

const partOne = (input: string): number => {
    return parseInput(input).map(extrapolateForward).reduce((a, b): number => a + b, 0)
}
const partTwo = (input: string): number => {
    return parseInput(input).map(extrapolateBackward).reduce((a, b): number => a + b, 0)
}

// console.log(partOne(testData))
console.log(partTwo(data))