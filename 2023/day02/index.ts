import data from './input.ts'
import testData from './test.ts'

type CubeType = 'red' | 'blue' | 'green'
type Game = Partial<Record<CubeType, number>>
type GameList = Record<number, Game[]>
const cubeTotalMap: Record<CubeType, number> = {
  'red': 12,
  'green': 13,
  'blue': 14,
}
const cubeTypes: CubeType[] = ['red', 'green', 'blue']


const parseInput = (input: string): GameList => {
  return Object.fromEntries(input.split('\n').map((line: string): [number, Game[]] => {
    const matches = line.match(/Game ([\d]+): (.*)/)
    if (!matches) {
      throw new Error()
    }
    const id = parseInt(matches[1] as string)
    const games = matches[2].split('; ').map((gameString: string): Game => {
      const cubeEntries = gameString.split(', ').map((cubeString: string): [CubeType, number] => {
        const cubeMatch = cubeString.match(/([\d]+) (.*)/)
        if (!cubeMatch) {
          throw new Error()
        }
        return [cubeMatch[2] as CubeType, parseInt(cubeMatch[1] as string)]
      })
      return Object.fromEntries(cubeEntries)
    })
    return [id, games]
  }))
}


const partOne = (input: string): number => {
  return Object.entries(parseInput(input)).map(([id, games]): number => {
    for (const game of games) {
      for (const cubeType of cubeTypes) {
        if ((game[cubeType] || 0) > cubeTotalMap[cubeType]) {
          return 0
        }
      }
    }
    return parseInt(id)
  }).reduce((a: number, b: number): number => a + b, 0)
}

const partTwo = (input: string): number => {
  return Object.values(parseInput(input)).map(games => {
    const maxCubes: Record<CubeType, number> = {
      'red': 0,
      'green': 0,
      'blue': 0,
    }
    for (const game of games) {
      for (const cubeType of cubeTypes) {
        const count = game[cubeType] || 0
        if (count > maxCubes[cubeType]) {
          maxCubes[cubeType] = count
        }
      }
    }
    return Object.values(maxCubes).reduce((a: number, b: number): number => a * b, 1)
  }).reduce((a: number, b: number): number => a + b, 0)
}

console.log(partOne(data))
console.log(partTwo(data))
