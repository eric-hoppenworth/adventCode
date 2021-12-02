import data from './input.ts'
import testData from './test.ts'

const FORWARD = 'forward'
const DOWN = 'down'
const UP = 'up'

type Vector = {
  row: number;
  col: number;
  aim: number;
}
type CommandTuple = [string, number];
type VectorTransformer = (command:CommandTuple, currentPositon: Vector) => Vector

const addVectors = (a: Vector, b:Vector): Vector => {
  return {
    row: a.row + b.row,
    col: a.col + b.col,
    aim: a.aim + b.aim,
  }
}
const parseInput = (inputString: string): CommandTuple[] => {
  return inputString.split('\n').map((rawCommand: string) => {
    const [name, value] = rawCommand.split(' ')
    return [name, parseInt(value, 10)]
  })
}

const getVectorFromCommandPartOne: VectorTransformer = (command:CommandTuple, currentPositon: Vector): Vector => {
  const [name, value] = command
  if (name === FORWARD) {
    return {
      row: 0,
      col: value,
      aim: 0,
    }
  }
  if (name === DOWN) {
    return {
      row: value,
      col: 0,
      aim: 0,
    }
  }
  if (name === UP) {
    return {
      row: -1 * value,
      col: 0,
      aim: 0,
    }
  }
  return { row:0, col: 0, aim: 0 }
}

const getVectorFromCommandPartTwo: VectorTransformer = (command:CommandTuple, currentPositon: Vector): Vector => {
  const [name, value] = command
  if (name === FORWARD) {
    return {
      row: value,
      col: currentPositon.aim * value,
      aim: 0,
    }
  }
  if (name === DOWN) {
    return {
      row: 0,
      col: 0,
      aim: value,
    }
  }
  if (name === UP) {
    return {
      row: 0,
      col: 0,
      aim: -1 * value,
    }
  }
  return { row:0, col: 0, aim: 0 }
}

const main = (inputString: string, getVectorFromCommand: VectorTransformer): Vector => {
  let position: Vector = {
    row: 0,
    col: 0,
    aim: 0,
  }
  const commands: CommandTuple[] = parseInput(inputString)
  commands.forEach(command => {
    const vector = getVectorFromCommand(command, position)
    position = addVectors(position, vector)
  });
  return position
}

const partOne = (input: string): number => {
  const finalPosition = main(input, getVectorFromCommandPartOne)
  console.log(finalPosition)
  return finalPosition.row * finalPosition.col
}

const partTwo = (input: string): number => {
  const finalPosition = main(input, getVectorFromCommandPartTwo)
  console.log(finalPosition)
  return finalPosition.row * finalPosition.col
}

// console.log(partOne(testData))
console.log(partTwo(data))
