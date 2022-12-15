import data from './input.ts'
import testData from './test.ts'

const parseInput = (input: string): number[] => {
  return input.split('\n').map(line => {
    if (line === 'noop') {
      return 0
    }
    return parseInt(line.slice(4), 10)
  })
}

const partOne = (input: string): number => {
  const inputs = parseInput(input)
  let register = 1
  let cycleNumber = 1
  let specialRegisters = [20, 60, 100, 140, 180, 220]
  let total = 0
  inputs.forEach((op) => {
    // during the cycle
    if (specialRegisters.includes(cycleNumber)) {
      total += register * cycleNumber
    }
    if (!op) {
      cycleNumber++
      return
    }
    cycleNumber++
    // during the cycle...
    if (specialRegisters.includes(cycleNumber)) {
      total += register * cycleNumber
    }
    register += op
    cycleNumber++
  })
  return total
}

const partTwo = (input: string): string[] => {
  const inputs = parseInput(input)
  let register = 1
  let cycleNumber = 1
  let lines = ['', '', '', '', '', '']
  inputs.forEach((op) => {
    // during the cycle
    let xPosition = (cycleNumber - 1) % 40
    let lineNumber = Math.floor((cycleNumber - 1) / 40)
    if (Math.abs(register - xPosition) <= 1) {
      lines[lineNumber] = lines[lineNumber] + '#'
    } else {
      lines[lineNumber] = lines[lineNumber] + '.'
    }

    if (!op) {
      cycleNumber++
      return
    }
    cycleNumber++
    // during the cycle...
    xPosition = (cycleNumber - 1) % 40
    lineNumber = Math.floor((cycleNumber - 1) / 40)
    if (Math.abs(register - xPosition) <= 1) {
      lines[lineNumber] = lines[lineNumber] + '#'
    } else {
      lines[lineNumber] = lines[lineNumber] + '.'
    }
    register += op
    cycleNumber++
  })
  return lines
}

// console.log(partOne(data))
console.log(partTwo(data))
