import data from './input.ts'
import testData from './test.ts'

const parseInput = (input: string): string[] => {
  return input.split('\n')
}

const highestInList = (partialBank: string): string => {
  return Math.max(...partialBank.split('').map(a => parseInt(a))).toString()
}

const checkBank = (bank: string, numberOfBatteries: number): number => {
  const batteries = []
  for (let i = 0; i < numberOfBatteries; i++) {
    batteries.push(highestInList(bank.slice(0,(1 - numberOfBatteries + i) || undefined)))
    bank = bank.slice(bank.indexOf(batteries[i]) + 1)
  }
  return parseInt(batteries.join(''))
}

const partOne = (input: string): number => {
  const banks = parseInput(input)
  let result = 0
  for (const bank of banks) {
    result += checkBank(bank, 2)
  }
  return result
}
const partTwo = (input: string): number => {
  const banks = parseInput(input)
  let result = 0
  for (const bank of banks) {
    result += checkBank(bank, 12)
  }
  return result
}

console.log(partOne(data))
console.log(partTwo(data))
