import data from './input.ts'
import testData from './test.ts'

type Range = {
  min: number;
  max: number;
}

type Kitchen = {
  ranges: Range[];
  ingredients: number[];
}

const parseInput = (input: string): Kitchen => {
  const parts = input.split('\n')
  const ranges = parts.slice(0, parts.indexOf(""))
  const ingredients = parts.slice(parts.indexOf("") + 1)
  return {
    ranges: ranges.map(range => ({
      min: parseInt(range.slice(0, range.indexOf('-'))),
      max: parseInt(range.slice(range.indexOf('-') + 1)),
    })),
    ingredients: ingredients.slice('\n').map(a => parseInt(a))
  }
}

const checkIngredient = (ingredient:number, ranges: Range[]): boolean => {
  return ranges.some(range => ingredient >= range.min && ingredient <= range.max)
}

const partOne = (input: string): number => {
  const kitchen = parseInput(input)
  return kitchen.ingredients.reduce((carry, ingredient) => {
    return carry + (checkIngredient(ingredient, kitchen.ranges) ? 1 : 0)
  }, 0)
}
const findNextRange = (value: number, ranges: Range[]): { value: number; gap: number } => {
  for (const range of ranges) {
    if (value >= range.min && value < range.max) {
      return { value: range.max, gap: 0 }
    }
  }
  let lowest = Infinity
  for (const range of ranges) {
    if (range.min < lowest && range.min > value) {
      lowest = range.min
    }
  }
  if (lowest === Infinity) {
    return undefined
  }
  return { value: lowest, gap: lowest - value - 1 }
}
const partTwo = (input: string): number => {
  const { ranges } = parseInput(input)
  let startRange = { min: Infinity, max: 0 }
  for (const range of ranges) {
    if (range.min < startRange.min) {
      startRange = range
    }
  }
  let count = 0
  let step = { value: startRange.max, gap: 0 }
  while (true) {
    const next = findNextRange(step.value, ranges)
    if (!next) {
      break
    }
    count += next.gap
    step = next
  }


  return step.value - startRange.min + 1 - count
}

// console.log(partOne(data))
console.log(partTwo(data))
