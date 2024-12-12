import data from './input.ts'
import testData from './test.ts'

type Rules = {
  [x: string]: string[];
}

type Manual = string[]

type PrintInstructions = {
  rules: Rules;
  manuals: Manual[];
}
const parseInput = (input: string): PrintInstructions => {
  const [unparsedRules, unparsedManuals] = input.split('\n\n')
  const rules: Rules = {}
  unparsedRules.split('\n').forEach(line => {
    const [key, value] = line.split('|')
    if (!rules[key]) {
      rules[key] = []
    }
    rules[key].push(value)
  });
  return {
    rules,
    manuals: unparsedManuals.split('\n').map(line => line.split(','))
  }
}

const checkManual = (manual: Manual, rules: Rules) => {
  return manual.every((page, index) => {
    for (let i = index + 1; i < manual.length; i++) {
      if (!(rules[page] || []).includes(manual[i])) {
        return false
      }
    }
    return true
  })
}

const partOne = (input: string): number => {
  const printInstructions = parseInput(input)
  return printInstructions.manuals.reduce((carry, manual) => {
    if (checkManual(manual, printInstructions.rules)) {
      const middleIndex = (manual.length - 1) / 2
      return carry + parseInt(manual[middleIndex])
    } else {
      return carry
    }
  }, 0)
}
const partTwo = (input: string): number => {
  const printInstructions = parseInput(input)
  return printInstructions.manuals.reduce((carry, manual) => {
    if (!checkManual(manual, printInstructions.rules)) {
      manual.sort((a, b) => {
        if (printInstructions.rules[b] && printInstructions.rules[b].includes(a)) {
          return 1
        }
        if (printInstructions.rules[a] && printInstructions.rules[a].includes(b)) {
          return -1
        }
        return 0
      })
      const middleIndex = (manual.length - 1) / 2
      return carry + parseInt(manual[middleIndex])
    } else {
      return carry
    }
  }, 0)
}

// console.log(partOne(data))
console.log(partTwo(data))
