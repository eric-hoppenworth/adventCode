import data from './input.ts'
import testData from './test.ts'

const openers = ['[', '<', '{', '('] as const
const closers = [']', '>', '}', ')'] as const
type OpenerCharacter = (typeof openers)[number]
type CloserCharacter = (typeof closers)[number]
type CloserMap = Map<OpenerCharacter,CloserCharacter>
type ScoreMap = Map<CloserCharacter,number>
type NavigationLine = (OpenerCharacter | CloserCharacter)[]

// NOTE: these maps don't work as well as i'd expect.
// I know that all of my closing characters are in here, but TS doesn't know that
// interestingly, TS DOES know when I try to use a type different from the key, and won't let me access the map with an invalid type
// (even though something like .has(key) with a bad key is not a 'bug')
const closingMap: CloserMap = new Map()
closingMap.set('[', ']')
closingMap.set('<', '>')
closingMap.set('{', '}')
closingMap.set('(', ')')

const scoreMapOne: ScoreMap = new Map()
scoreMapOne.set(']', 57)
scoreMapOne.set('>', 25137)
scoreMapOne.set('}', 1197)
scoreMapOne.set(')', 3)

const scoreMapTwo: ScoreMap = new Map()
scoreMapTwo.set(']', 2)
scoreMapTwo.set('>', 4)
scoreMapTwo.set('}', 3)
scoreMapTwo.set(')', 1)

const parseInput = (input: string): NavigationLine[] => {
  return input.split('\n').map((line: string): NavigationLine => line.split('') as NavigationLine)
}

const partOne = (lines: NavigationLine[], scoreMap: ScoreMap): number => {
  return lines.reduce((carry: number, line: NavigationLine): number => {
    const commandArray: OpenerCharacter[] = []
    for (const character of line) {
      if (closers.includes(character as CloserCharacter)) {
        const lastCommand = commandArray.pop()
        if (!lastCommand) {
          return carry
        }
        if (closingMap.get(lastCommand) !== character) {
          return carry + (scoreMap.get(character as CloserCharacter) || 0)
        }
      } else if (openers.includes(character as OpenerCharacter)) {
        commandArray.push(character as OpenerCharacter);
      }
    }
    return carry
  }, 0)
}


const getCommandList = (line: NavigationLine): OpenerCharacter[] => {
  const commandArray: OpenerCharacter[] = []
  for (const character of line) {
    if (closers.includes(character as CloserCharacter)) {
      const lastCommand = commandArray.pop()
      if (!lastCommand) {
        return []
      }
      if (closingMap.get(lastCommand) !== character) {
        return []
      }
    } else if (openers.includes(character as OpenerCharacter)) {
      commandArray.push(character as OpenerCharacter);
    }
  }
  return commandArray
}

const partTwo = (lines: NavigationLine[], scoreMap: ScoreMap): number => {
  let scores: number[] = []
  lines.forEach((line: NavigationLine) => {
    const commandList = getCommandList(line)
    if (!commandList.length) {
      return
    }
    commandList.reverse()
    scores.push(
      commandList.reduce((carry: number, char: OpenerCharacter): number => {
        return (carry * 5) + (closingMap.get(char) ? (scoreMap.get(closingMap.get(char) as CloserCharacter) || 0) : 0)
      }, 0)
    )
  });
  scores.sort((a,b) => a - b)
  return scores[(scores.length-1)/2]
}

// console.log(partOne(parseInput(data), scoreMapOne))
console.log(partTwo(parseInput(data), scoreMapTwo))
