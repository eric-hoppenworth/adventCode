import data from './input.ts'
import testData from './test.ts'

type Location = { row: number; col: number }
type Part = {
  symbol: string;
  location: Location;
}
type PartNumber = {
  number: string;
  locations: Location[]
}

type Schematic = {
  parts: Part[];
  numbers: PartNumber[];
}

const parseInput = (input: string): Schematic => {
  const numberRegex = /[\d]/
  const parts: Part[] = []
  const numbers: PartNumber[] = []
  input.split('\n').map((line: string, row: number) => {
    let currentNumber: PartNumber = {
      number: '',
      locations: []
    }
    for (let col in line.split('')) {
      const symbol = line[col]
      if (numberRegex.test(symbol)) {
        currentNumber.number += symbol
        currentNumber.locations.push({ row, col: parseInt(col) })
      } else {
        if (currentNumber.number) {
          numbers.push(currentNumber)
        }
        currentNumber = {
          number: '',
          locations: []
        }
        if (symbol !== '.') {
          parts.push({
            symbol, location: { row, col: parseInt(col) }
          })
        }
      }
    }
    if (currentNumber.number) {
      numbers.push(currentNumber)
    }
  })
  return { parts, numbers }
}

const isAdjacent = (a: Location, b: Location): boolean => {
  for (let row = -1; row <= 1; row++) {
    for (let col = -1; col <= 1; col++) {
      if ((a.row + row === b.row) && (a.col + col === b.col)) {
        return true
      }
    }
  }
  return false
}

const partOne = (input: string): number => {
  const schematic = parseInput(input)
  return schematic.numbers.reduce((carry: number, partNumber): number => {
    const hasAdjacentPart = schematic.parts.some((part) =>
      partNumber.locations.some((location: Location) => isAdjacent(part.location, location))
    )
    if (hasAdjacentPart) {
      return parseInt(partNumber.number) + carry
    }
    return carry
  }, 0)
}

const partTwo = (input: string): number => {
  const schematic = parseInput(input)
  return schematic.parts.reduce((carry: number, part): number => {
    let value = 0
    if (part.symbol === '*') {
      const numbers = schematic.numbers.filter((partNumber) =>
        partNumber.locations.some((location: Location) => isAdjacent(part.location, location))
      )
      if (numbers.length === 2) {
        value = parseInt(numbers[0].number) * parseInt(numbers[1].number)
      }
    }
    return carry + value
  }, 0)
}

// console.log(partOne(data))
console.log(partTwo(data))
