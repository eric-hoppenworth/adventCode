import data from './input.ts'
import testData from './test.ts'

type InsertionRules = Map<string,string>
type BaseCounter = Map<string,number>
type PairCounter = Map<string,number>
type PolymerTemplate = {
  base: string
  rules: InsertionRules
}


const parseInput = (input: string): PolymerTemplate => {
  const [base, rulesString] = input.split('\n\n')
  const rules = new Map()
  rulesString.split('\n').forEach((rule:string) => {
    const [pattern, addition] = rule.split(' -> ')
    rules.set(pattern, addition)
  })
  return {
    base,
    rules,
  }
}

const getPairCounterFromBase = (base: string): PairCounter => {
  const map: PairCounter = new Map()
  for(let i = 0; i < base.length - 1; i++) {
    const pair = base[i] + base[i+1]
    map.set(pair, (map.get(pair) || 0) + 1)
  }
  return map
}

const polymerize = (pairCounter: PairCounter, rules: InsertionRules): PairCounter => {
  const map: PairCounter = new Map()
  for (const [pair, count] of pairCounter) {
    const replacement = rules.get(pair)
    if (replacement) {
      const leftHand = pair[0] + replacement
      map.set(leftHand, (map.get(leftHand)|| 0) + count)
      const rightHand = replacement + pair[1]
      map.set(rightHand, (map.get(rightHand)|| 0) + count)
    }
  }
  return map
}

const countLetters = (pairCounter: PairCounter): number => {
  const map: BaseCounter = new Map()
  for(const [pair, count] of pairCounter) {
    const leftHand = pair[0]
    map.set(leftHand, (map.get(leftHand)|| 0) + count)
    const rightHand = pair[1]
    map.set(rightHand, (map.get(rightHand)|| 0) + count)
  }
  let min = Infinity
  let max = -Infinity
  for (const [key, value] of map) {
    if (value > max) {
      max = value
    }
    if (value < min) {
      min = value
    }
  }
  return Math.round((max - min) / 2)
}

const partOne = (template: PolymerTemplate): number => {
  let pairCounter = getPairCounterFromBase(template.base)
  for (let i = 0; i < 10; i++) {
    pairCounter = polymerize(pairCounter, template.rules)
  }
  return countLetters(pairCounter)
}
const partTwo = (template: PolymerTemplate): number => {
  let pairCounter = getPairCounterFromBase(template.base)
  for (let i = 0; i < 40; i++) {
    pairCounter = polymerize(pairCounter, template.rules)
  }
  return countLetters(pairCounter)
}

console.log(partOne(parseInput(data)))
// console.log(partTwo(parseInput(data)))
