import data from './input.ts'
import testData from './test.ts'

// note: higher type is better
const typeMap: Record<string, number> = {
  'HIGH_CARD': 1,
  'ONE_PAIR': 2,
  'TWO_PAIR': 3,
  'THREE_OF_A_KIND': 4,
  'FULL_HOUSE': 5,
  'FOUR_OF_A_KIND': 6,
  'FIVE_OF_A_KIND': 7,
}

type Hand = {
  bid: number;
  cards: number[];
  type: number;
}

const parseInput = (input: string, useJokers = false): Hand[] => {
  let cardRank: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
  if (useJokers) {
    cardRank = ['J', ...cardRank.filter(a => a !== 'J')]
  }
  return input.split('\n').map((line) => {
    const sections = line.split(' ');
    const bid = parseInt(sections[1])
    const cards = sections[0].split('').map(a => cardRank.indexOf(a))
    const type = getHandType(cards, useJokers)
    return { bid, cards, type }
  })
}

const getHandType = (cards: number[], useJokers: boolean): number => {
  const cardCounts: Record<number, number> = {}

  for (const card of cards) {
    if (cardCounts[card] === undefined) {
      cardCounts[card] = 0
    }
    cardCounts[card]++
  }
  const jokerCount: number = useJokers && cardCounts[0] || 0
  if (useJokers) {
      delete cardCounts[0]
  }
  const counts = Object.values(cardCounts)
  if (counts.filter((a) => a + jokerCount >= 5).length || jokerCount === 5) {
    return typeMap.FIVE_OF_A_KIND
  }
  if (counts.filter((a) => a + jokerCount >= 4).length) {
    return typeMap.FOUR_OF_A_KIND
  }
  for (let i = 0; i < counts.length - 1; i++) {
      for (let j = i + 1; j < counts.length; j++) {
          if (counts[i] + counts[j] + jokerCount >= 5) {
              return typeMap.FULL_HOUSE
          }
      }
  }
  if (counts.filter((a) => a + jokerCount >= 3).length) {
    return typeMap.THREE_OF_A_KIND
  }
  for (let i = 0; i < counts.length - 1; i++) {
      for (let j = i + 1; j < counts.length; j++) {
          if (counts[i] + counts[j] + jokerCount >= 4) {
              return typeMap.TWO_PAIR
          }
      }
  }
  if (counts.filter((a) => a + jokerCount >= 2).length) {
    return typeMap.ONE_PAIR
  }
  return typeMap.HIGH_CARD
}

const sortHands = (hands: Hand[]): void => {
  hands.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type - b.type
    }
    for (let i = 0; i < a.cards.length; i++) {
      if (a.cards[i] !== b.cards[i]) {
        return a.cards[i] - b.cards[i]
      }
    }
    return 0
  });
}
const scoreHands = (hands: Hand[]): number => {
  sortHands(hands)
  console.log(hands)
  return hands.reduce((carry: number, hand: Hand, index: number): number => {
    return carry + (index + 1) * hand.bid
  }, 0)
}

const partOne = (input: string): number => {
  return scoreHands(parseInput(input))
}
const partTwo = (input: string): number => {
  return scoreHands(parseInput(input, true))
}

// console.log(partOne(testData))
console.log(partTwo(data))
