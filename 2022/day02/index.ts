import data from './input.ts'
import testData from './test.ts'
type Round = {
  elf: ElfChoice;
  player: PlayerChoice;
}

type MappedRound = {
  elf: Choice;
  player: Choice;
}

enum Choice {
  Rock = 'ROCK',
  Paper = 'PAPER',
  Scissors = 'SCISSORS',
}

enum ElfChoice {
  A = 'A',
  B = 'B',
  C = 'C',
}
enum PlayerChoice {
  X = 'X',
  Y = 'Y',
  Z = 'Z',
}

const elfMap: { [key in ElfChoice]: Choice } = {
  'A': Choice.Rock,
  'B': Choice.Paper,
  'C': Choice.Scissors,
}

const playerMap: { [key in PlayerChoice]: Choice } = {
  'X': Choice.Rock,
  'Y': Choice.Paper,
  'Z': Choice.Scissors,
}

const baseScoreMap: { [key in Choice]: number } = {
  [Choice.Rock]: 1,
  [Choice.Paper]: 2,
  [Choice.Scissors]: 3,
}
const scoreMap: { [key in Choice]: { [key in Choice]: number } } = {
  [Choice.Rock]: {
    [Choice.Rock]: 3,
    [Choice.Paper]: 6,
    [Choice.Scissors]: 0,
  },
  [Choice.Paper]: {
    [Choice.Rock]: 0,
    [Choice.Paper]: 3,
    [Choice.Scissors]: 6,
  },
  [Choice.Scissors]: {
    [Choice.Rock]: 6,
    [Choice.Paper]: 0,
    [Choice.Scissors]: 3,
  },
}
const palyerWinMap: { [key in PlayerChoice]: { [key in Choice]: Choice } } = {
  'X': {
    [Choice.Rock]: Choice.Scissors,
    [Choice.Paper]: Choice.Rock,
    [Choice.Scissors]: Choice.Paper,
  },
  'Y': {
    [Choice.Rock]: Choice.Rock,
    [Choice.Paper]: Choice.Paper,
    [Choice.Scissors]: Choice.Scissors,
  },
  'Z': {
    [Choice.Rock]: Choice.Paper,
    [Choice.Paper]: Choice.Scissors,
    [Choice.Scissors]: Choice.Rock,
  },
}
const parseInput = (inputString: string): Round[] => {
  return inputString.split('\n').map((stringRound: string) => {
    const [a, b] = stringRound.split(' ')
    return { elf: a as ElfChoice, player: b as PlayerChoice}
  })
}

const getRoundScore = (round: MappedRound): number => {
  const baseScore = baseScoreMap[round.player]
  const score = scoreMap[round.elf][round.player]
  return score + baseScore
}


const partOne = (input: string): number => {
  const rounds = parseInput(input)
  return rounds.reduce((carry, round) => {
    const mappedRound: MappedRound = {
      elf: elfMap[round.elf],
      player: playerMap[round.player],
    }
    return carry + getRoundScore(mappedRound)
  }, 0)
}

const partTwo = (input: string): number => {
  const rounds = parseInput(input)
  return rounds.reduce((carry, round) => {
    const elfChoice: Choice = elfMap[round.elf]
    const mappedRound: MappedRound = {
      elf: elfChoice,
      player: palyerWinMap[round.player][elfChoice],
    }
    return carry + getRoundScore(mappedRound)
  }, 0)
}

console.log(partOne(data))
console.log(partTwo(data))
