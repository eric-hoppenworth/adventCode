import data from './input.ts'
import testData from './test.ts'
import testData2 from './test2.ts'

type Command = {
  a: number;
  b: number;
}

const parseCommand = (command: string): Command => {
  const matches = command.match(/([\d]{1,3}),([\d]{1,3})/) || []
  return {
    a: parseInt(matches[1]) || 0,
    b: parseInt(matches[2]) || 0
  }
}

const parseInput = (input: string): Command[] => {
  const operations: string[] = input.match(/mul\([\d]{1,3},[\d]{1,3}\)/g) || []
  return operations.map(parseCommand)
}


const partOne = (input: string): number => {
  const commands = parseInput(input)
  return commands.reduce((carry, command) => {
    return carry + command.a * command.b
  }, 0)
}
const partTwo = (input: string): number => {
  const regex = /(do\(\))|(don't\(\))|(mul\([\d]{1,3},[\d]{1,3}\))/gm;
  let matches;
  let enabled = true;
  let total = 0;
  while ((matches = regex.exec(input)) !== null) {
      if (matches.index === regex.lastIndex) {
          regex.lastIndex++;
      }
      if (matches[1]) {
        enabled = true
      }
      if (matches[2]) {
        enabled = false
      }
      if (matches[3] && enabled) {
        const command = parseCommand(matches[3])
        total += command.a * command.b
      }
  }
  return total
}

// console.log(partOne(data))
console.log(partTwo(data))
