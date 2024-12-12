import data from './input.ts'
import testData from './test.ts'

type Report = Levels[]
type Levels = number[]

const parseInput = (input: string): Report => {
  return input.split('\n').map(line => line.split(' ').map(v => parseInt(v)))
}

const checkLevels = (levels: Levels): boolean => {
  let increasing = true;
  if (levels[1] < levels[0]) {
    increasing = false
  }
  if (levels[0] === levels[1]) {
    return false
  }
  for (let i = 0; i < levels.length - 1; i++) {
    if (levels[i] === levels[i + 1]) {
      return false
    }
    if (increasing && (levels[i + 1] < levels[i])) {
      return false
    }
    if (!increasing && (levels[i + 1] > levels[i])) {
      return false
    }
    if (Math.abs(levels[i] - levels[i + 1]) > 3) {
      return false
    }
  }
  return true
}


const partOne = (input: string): number => {
  const report = parseInput(input)

  return report.reduce((carry, levels) => {
    return checkLevels(levels) ? carry + 1 : carry
  }, 0)
}
const partTwo = (input: string): number => {
  const report = parseInput(input)
    return report.reduce((carry: number, levels: Levels) => {
      for (let i = 0; i < levels.length; i++) {
        // TODO: remove just index i from the array
        const adjustedLevels = [
          ...levels.slice(0, i),
          ...levels.slice(i + 1)
        ];
        if (checkLevels(adjustedLevels)) {
          return carry + 1
        }
      }
      return carry
    }, 0)
}

console.log(partTwo(data))
