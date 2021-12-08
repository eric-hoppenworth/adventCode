import data from './input.ts'
import testData from './test.ts'

const parseInput = (input: string): number[] => {
  return input.split(',').map((val) => parseInt(val, 10))
}


const calcGas = (stepCount: number): number => {
  return stepCount * (stepCount + 1) / 2
}

const partOne = (input: number[]): number => {
  input.sort((a, b) => a - b)
  const medianIndex = input.length / 2
  const median = input[medianIndex]
  return input.reduce((carry, position) => carry + Math.abs(position - median), 0)
}

const partTwo = (input: number[]): number => {
  let minGas = Infinity
  const maxPos = Math.max(...input)
  for (let testPosition = 0; testPosition < input.length; testPosition++) {
    const gas = input.reduce((carry, position) => carry + calcGas(Math.abs(position - testPosition)), 0)
    if (gas < minGas) {
      minGas = gas
    }
  }
  return minGas
}

console.log(partOne(parseInput(data)))
console.log(partTwo(parseInput(data)))
