import data from './input.ts'
import testData from './test.ts'

type Direction = 'L' | 'R'
type Command = {
  direction: Direction;
  count: number;
}

const parseInput = (input: string): Command[] => {
  return input.split('\n').map(line => ({ direction: line.slice(0,1) as Direction, count: parseInt(line.slice(1))}))
}

const turnDial = (value: number, command: Command): number => {
  return (((value + (command.count * (command.direction === 'L' ? -1 : 1))) % 100) + 100) % 100
}

const evaluateTurn = (command: Command) => {
  return Math.floor(command.count / 100)
}
const partOne = (input: string): number => {
  const commands = parseInput(input)
  let position = 50
  let numberOfZeroes = 0
  for (const command of commands) {
    position = turnDial(position, command)
    if (position === 0) {
      numberOfZeroes++
    }
  }

  return numberOfZeroes
}
const partTwo = (input: string): number => {
  const commands = parseInput(input)
  let position = 50
  let numberOfZeroes = 0
  for (const command of commands) {
    let initial = position
    numberOfZeroes += evaluateTurn(command)
    position = turnDial(position, command)
    if (command.direction === 'L') {
      numberOfZeroes += position > initial ? 1 : 0
    } else {
      numberOfZeroes += position < initial ? 1 : 0
    }
  }

  return numberOfZeroes
}

console.log(partOne(data))
console.log(partTwo(data))
