import data from './input.ts'
import testData from './test.ts'

type Range = {
  min: number;
  max: number;
}
const parseInput = (input: string): Range[] => {
  return input.split(',').map(line => ({
    min: parseInt(line.slice(0, line.indexOf('-'))),
    max: parseInt(line.slice(line.indexOf('-') + 1))
  }))
}

const partOne = (input: string): number => {
  // brute force approach
  const ranges = parseInput(input)
  let result = 0
  for (const range of ranges) {
    for (let i = range.min; i <= range.max; i++) {
      const numberOfDigits = Math.floor(Math.log10(i)) + 1
      if (numberOfDigits % 2 === 1) {
        // odd number of digits, increase i to an even number of digits
        i = Math.pow(10, numberOfDigits)
        continue
      }
      const divisor = Math.pow(10, numberOfDigits / 2)
      if (Math.floor(i / divisor) === (i % divisor)) {
        result += i
      }
    }
  }

  return result
}
const partTwo = (input: string): number => {

  const ranges = parseInput(input)
  let result = 0
  for (const range of ranges) {
    for (let i = range.min; i <= range.max; i++) {
      const regex = /^(.*)\1{1,}$/
      result += regex.test(i.toString()) ? i : 0
    }
  }

  return result
}

// console.log(partOne(data))
console.log(partTwo(data))
