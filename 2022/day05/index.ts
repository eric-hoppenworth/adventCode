import data from './input.ts'
import testData from './test.ts'

type Pile = Container[]
type Container = string

type Command = {
  amount: number;
  to: number;
  from: number;
}

type Puzzle = {
  piles: Pile[],
  commands: Command[]
}

const parseInput = (input: string): Puzzle => {
  const [containerInput, commandInput, ...rest] = input.split('\n\n')
  const piles: Pile[] = []
  containerInput.split('\n').map((line: string) => {
    let m
    const regex = /\[([A-Z])\]/gm
    while ((m = regex.exec(line)) !== null) {
      const containerIndex = m.index / 4
      if (!piles[containerIndex]) {
        piles[containerIndex] = []
      }
      // NOTE: piles are set up so that the BOTTOM of the pile is at index 0
      // This means when we move items, we use `push` and `pop`
      piles[containerIndex].unshift(m[1])
      if (m.index === regex.lastIndex) {
        regex.lastIndex++
      }
    }
  })
  const commands = commandInput.split('\n').map((line: string) => {
    const regex = /move ([\d]{1,}) from ([\d]{1,}) to ([\d]{1,})/
    const matches = line.match(regex) || []
    return {
      amount: parseInt(matches[1] || '0', 10),
      from: parseInt(matches[2] || '0', 10) - 1, // NOTE: container index is 1 less than command index
      to: parseInt(matches[3] || '0', 10) - 1, // NOTE: container index is 1 less than command index
    }
  })
  return {
    piles,
    commands,
  }
}

// NOTE: this mutates the piles
const doCommandOneAtATime = (piles: Pile[], command: Command): Pile[] => {
  for (let i = 0; i < command.amount; i++) {
    const container: Container | undefined = piles[command.from].pop()
    if (container === undefined) {
      throw new Error()
    }
    piles[command.to].push(container)
  }
  return piles
}
const doCommandOneAllAtOnce = (piles: Pile[], command: Command): Pile[] => {
  const fromPile = piles[command.from]
  const position = fromPile.length - command.amount
  const [remaining, moving] = [fromPile.slice(0, position), piles[command.from].slice(position)]
  piles[command.from] = remaining
  piles[command.to] = piles[command.to].concat(moving)
  return piles
}

const getTops = (piles: Pile[]) => {
  return piles.reduce((carry, pile: Pile) => carry + pile[pile.length - 1], '')
}

const partOne = (input: string): string => {
  const puzzle = parseInput(input)
  puzzle.commands.forEach(command => {
    doCommandOneAtATime(puzzle.piles, command)
  });
  return getTops(puzzle.piles)
}
const partTwo = (input: string): string => {
  const puzzle = parseInput(input)
  puzzle.commands.forEach(command => {
    doCommandOneAllAtOnce(puzzle.piles, command)
  });
  return getTops(puzzle.piles)
}
// console.log(partOne(data))
console.log(partTwo(data))
