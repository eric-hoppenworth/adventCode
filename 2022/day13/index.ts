import data from './input.ts'
import testData from './test.ts'

type Pair = [List, List]
type List = Signal[]
type Signal = number | Signal[]

const parseInput = (input: string): Pair[] => {
  return input.split('\n\n').map((pair) => pair.split('\n').map(a => JSON.parse(a)) as Pair)
}
const compareInt = (a: number, b: number): number  => a === b ? 0 : (a < b ? 1 : -1)
const compareList = (left: Signal[], right: Signal[]): number => {
  for (const index in left) {
    const leftType = typeof left[index]
    const rightType = typeof right[index]

    if (leftType === rightType) {
      if (leftType === 'undefined') {
        return 0
      }
      if (leftType === 'number') {
        const comparison = compareInt(left[index] as number, right[index] as number)
        if (comparison) {
          return comparison
        }
      }
      if (leftType === 'object') {
        const comparison = compareList(left[index] as Signal[], right[index] as Signal[])
        if (comparison) {
          return comparison
        }
      }
    }
    if (rightType === 'undefined' && leftType !== 'undefined') {
      return -1
    }
    if (leftType === 'object' && rightType === 'number') {
      const comparison = compareList(left[index] as Signal[], [right[index]])
      if (comparison) {
        return comparison
      }
    }
    if (rightType === 'object' && leftType === 'number') {
      const comparison = compareList([left[index]], right[index] as Signal[])
      if (comparison) {
        return comparison
      }
    }
  }
  if (left.length === right.length) {
    return 0
  }
  return 1
}

const partOne = (input: string): number => {
  const pairs = parseInput(input)
  return pairs.reduce((carry, pair, index) => carry + (compareList(...pair) === 1 ? index + 1 : 0), 0)
}

const partTwo = (input: string): number => {
  const pairs = parseInput(input)
  const dividers: Signal[][] = [[[2]], [[6]]]
  return pairs
    .flat(1)
    .concat(dividers)
    .sort(compareList)
    .reverse()
    .reduce((carry, signal, index) => carry * (dividers.includes(signal) ? (index + 1) : 1), 1)
}


// console.log(partOne(data))
console.log(partTwo(data))
