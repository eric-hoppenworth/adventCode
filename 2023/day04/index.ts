import data from './input.ts'
import testData from './test.ts'

type ScratchCard = {
  index: number;
  winningNumbers: number[];
  myNumbers: number[];
}

const parseInput = (input: string): ScratchCard[] => {
  return input.split('\n').map((line, index) => {
    const matches = line.match(/: ([\d ]*) \| ([\d ]*)/)
    if (!matches || !matches[1] || ! matches[2]) {
      throw new Error();
    }
    return {
      index,
      winningNumbers: matches[1].split(/[\s]+/).map(a => parseInt(a)),
      myNumbers: matches[2].split(/[\s]+/).map(a => parseInt(a)),
    }
  })
}

const getWinningCount = (card: ScratchCard): number => card.myNumbers.filter((num) => card.winningNumbers.includes(num)).length

const partOne = (input: string): number => {
  const cards = parseInput(input)
  return cards.reduce((carry: number, card): number => {
    const numberCount = getWinningCount(card)
    if (!numberCount) {
      return carry
    }
    return carry + Math.pow(2, numberCount - 1)
  }, 0)
}

const partTwo = (input: string): number => {
  const cards = parseInput(input)
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]
    const numberCount = getWinningCount(card)
    for (let copyIndex = 0; copyIndex < numberCount; copyIndex++) {
      cards.push({ ...cards[card.index + copyIndex + 1] })
    }
  }
  return cards.length
}

// console.log(partOne(data))
console.log(partTwo(data))
