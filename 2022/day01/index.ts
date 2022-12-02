import data from './input.ts'
import testData from './test.ts'
type Elf = number[]

const parseInput = (inputString: string): number[] => {
  const elves: Elf[] = inputString
    .split('\n\n').map(
      (line: string) => line
        .split('\n')
        .map((value: string) => parseInt(value, 10))
    )
  return elves.map((elf: Elf) => elf.reduce((carry, value) => carry + value, 0))
}

const partOne = (input: string): number => {
  const totalCalories = parseInput(input)
  return Math.max(...totalCalories)
}
const partTwo = (input: string, maxLength: number = 3): number => {
  const totalCalories = parseInput(input)
  const maximums: number[] = []
  for(const total of totalCalories) {
    if (maximums.length < maxLength) {
      maximums.push(total)
      continue
    }

    const min = Math.min(...maximums)
    if (total > min) {
      maximums[maximums.indexOf(min)] = total
      continue;
    }
  }
  return maximums.reduce((a,b) => a + b, 0)
}

// console.log(partOne(data))
console.log(partTwo(data))
