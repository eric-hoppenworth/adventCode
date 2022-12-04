import data from './input.ts'
import testData from './test.ts'

type Range = { min: number; max: number;}
type ElfPair = [Range, Range]

const parseInput = (input: string): ElfPair[] =>
  input.split('\n').map((line) =>
    line.split(',').map((range: string) => {
      const matches = range.split('-')
      return {
        min: parseInt(matches[0], 10),
        max: parseInt(matches[1], 10),
      }
    }) as ElfPair
  )
const checkFullOverlap = (rangeA: Range, rangeB: Range): boolean => {
  const check = (a: Range, b: Range): boolean => (a.min <= b.min && a.max >= b.max)
  return check(rangeA, rangeB) || check(rangeB, rangeA)
}

const checkAnyOverlap = ([a, b]: ElfPair): boolean => {
  for(let i = a.min; i <= a.max; i++) {
    if (i >= b.min && i <= b.max) {
      return true
    }
  }
  return false
}
const partOne = (input: string): number => {
  const pairs: ElfPair[] = parseInput(input)
  return pairs.filter((pair) => checkFullOverlap(pair[0], pair[1])).length
}
const partTwo = (input: string): number => {
  const pairs: ElfPair[] = parseInput(input)
  return pairs.filter(checkAnyOverlap).length
}
// console.log(partOne(data))
console.log(partTwo(data))
