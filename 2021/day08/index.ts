import data from './input.ts'
import testData from './test.ts'

type Display = {
  sequence: string[]
  output: string[]
}

type DisplayMap = {
  [value: string]: string
}

const parseInput = (input: string): Display[] => {
  return input.split('\n').map((val: string): Display => {
    const [ sequenceString, outputString ] = val.split(' | ')
    return {
      sequence: sequenceString.split(' ').map((code: string) => code.split('').sort().join('')),
      output: outputString.split(' ').map((code: string) => code.split('').sort().join('')),
    }
  })
}

const partOne = (displays: Display[]): number => {
  return displays.reduce((carry, display: Display) => carry + countEasyNumbers(display), 0)
}

const countEasyNumbers = (display: Display): number => {
  return display.output.reduce((carry, code: string) => carry + Number([2,3,4,7].includes(code.length)), 0)
}

const hasFullOverlapWithB = (codeA: string, codeB: string): boolean => {
  for (let i = 0; i < codeB.length; i++) {
    if (!codeA.includes(codeB[i])) {
      return false
    }
  }
  return true
}
const overlapCountWithB = (codeA: string, codeB: string): number => {
  let count = 0
  for (let i = 0; i < codeB.length; i++) {
    if (codeA.includes(codeB[i])) {
      count++
    }
  }
  return count
}

const findOneFourSevenEight = (displaySequence: string[]): DisplayMap => {
  const map = {} as DisplayMap
  displaySequence.forEach((code: string) => {
    if (code.length === 2) {
      map['1'] = code
    }
    if (code.length === 3) {
      map['7'] = code
    }
    if (code.length === 4) {
      map['4'] = code
    }
    if (code.length === 7) {
      map['8'] = code
    }
  })
  return map
}
const findThreeAndSix = (displaySequence: string[], oneCode: string): DisplayMap => {
  return {
    '3': displaySequence.find((code: string) => code.length === 5 && hasFullOverlapWithB(code, oneCode)) as string,
    '6': displaySequence.find((code: string) => code.length === 6 && !hasFullOverlapWithB(code, oneCode)) as string,
  }
}
const findFive = (displaySequence: string[], fourCode: string): string => {
  return displaySequence.find((code:string) => code.length === 5 && overlapCountWithB(code, fourCode) === 3) as string
}
const findTwo = (displaySequence: string[]): string => {
  return displaySequence.find((code:string) => code.length === 5) as string
}
const findNine = (displaySequence: string[], fiveCode: string): string => {
  return displaySequence.find((code: string) => hasFullOverlapWithB(code, fiveCode)) as string
}
// and zero is the last one left
const filterDisplaySequence = (sequence: string[], map: DisplayMap) => {
  return sequence.filter((elem: string) => !Object.values(map).includes(elem))
}

const getDisplayMap = (displaySequence: string[]): DisplayMap => {
  let map = findOneFourSevenEight(displaySequence)
  displaySequence = filterDisplaySequence(displaySequence, map)

  map = {
    ...map,
    ...findThreeAndSix(displaySequence, map['1'])
  }
  displaySequence = filterDisplaySequence(displaySequence, map)

  map['5'] = findFive(displaySequence, map['4'])
  displaySequence = filterDisplaySequence(displaySequence, map)

  map['2'] = findTwo(displaySequence)
  displaySequence = filterDisplaySequence(displaySequence, map)

  map['9'] = findNine(displaySequence, map['5'])
  displaySequence = filterDisplaySequence(displaySequence, map)

  map['0'] = displaySequence['0']
  return map
}

const translateOutput = (output: string[], displayMap: DisplayMap): number => {
  return parseInt(output.map((code: string) => (Object.entries(displayMap).find((entry) => entry[1] === code) || ['0'])[0]).join(''),10)
}

const interpretDisplay = (display: Display): number => {
  return translateOutput(display.output, getDisplayMap(display.sequence))
}
const partTwo = (input: Display[]): number => {
  return input.reduce((carry, display) => carry + interpretDisplay(display), 0)
}

console.log(partOne(parseInput(data)))
console.log(partTwo(parseInput(data)))
