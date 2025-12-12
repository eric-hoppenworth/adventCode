import data from './input.ts'
import testData from './test.ts'


type Operation = '+' | '*'
type Equation = {
  inputs: number[];
  operation: Operation;
}
const parseInput = (input: string): Equation[] => {
  const lines = input.split('\n').map(line => line.split(/[\s]{1,}/g).filter(Boolean))
  const operators = lines.pop()
  const equations: Equation[] = []
  for (const index in operators) {
    equations.push({
      inputs: lines.map(a => parseInt(a[index])),
      operation: operators[index]
    })
  }
  return equations
}

const evaluate = (equation: Equation): number => {
  if (equation.operation === '*') {
    return equation.inputs.reduce((carry, a) => carry * (isNaN(a) ? 1 : a), 1)
  }
  return equation.inputs.reduce((carry, a) => carry + (isNaN(a) ? 0 : a), 0)
}

const partOne = (input: string): number => {
  return parseInput(input).reduce((carry, a) => carry + evaluate(a), 0)
}
const partTwo = (input: string): number => {
  const lines = input.split('\n')
  const operatorLine = lines.pop()

  const equations: Equation[] = []
  for (const index in operatorLine) {
    if (operatorLine[index] !== ' ') {
      equations.push({ inputs: [], operation: operatorLine[index] })
    }
    // on each index,
    equations[equations.length - 1].inputs.push(parseInt(lines.reduce((carry, line) => carry + (line[index] || ''), '')))
  }
  return equations.reduce((carry, a) => carry + evaluate(a), 0)
}

// console.log(partOne(data))
console.log(partTwo(data))
