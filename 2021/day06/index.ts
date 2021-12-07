import data from './input.ts'
import testData from './test.ts'

type FishCounter = {
  [daysRemaining: number]: number
}
const MAX_FISH_DAYS = 7
const NEW_FISH_DAYS = 9

const parseInput = (inputString: string): FishCounter => {
  const arr: number[] = inputString.split(',').map((n) => parseInt(n, 10))
  const result = {} as FishCounter
  arr.forEach((element: number) => {
    if (!result[element]) {
      result[element] = 0
    }
    result[element]++
  });
  return result
}

const cycleDay = (fishCounter: FishCounter): FishCounter => {
  const result = {} as FishCounter
  for (const key in fishCounter) {
    const daysRemaining = parseInt(key, 10)
    let newDays = daysRemaining - 1
    if (newDays < 0) {
      newDays = MAX_FISH_DAYS - 1
      result[NEW_FISH_DAYS - 1] = fishCounter[daysRemaining]
    }

    if (!result[newDays]) {
      result[newDays] = 0
    }
    result[newDays] += fishCounter[daysRemaining]
  }
  return result
}
const countAllfish = (fishCounter: FishCounter): number => {
  let result = 0
  for (const daysRemaining in fishCounter) {
    result += fishCounter[daysRemaining]
  }
  return result
}

const partOne = (fishCounter: FishCounter, numberOfDays: number): number => {
  for (let i = 0; i < numberOfDays; i++) {
    fishCounter = cycleDay(fishCounter)
  }
  return countAllfish(fishCounter)
}

console.log(partOne(parseInput(data), 80))
console.log(partOne(parseInput(data), 256))
