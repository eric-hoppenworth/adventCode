import data from './input.ts'
import testData from './test.ts'

type Tile = '.' | '^' | 'S'

type GameMap = Tile[][]

type Vector = { row: number, col: number }

const parseInput = (input: string): GameMap => {
  return input.split('\n').map(a => a.split(''))
}

const getStart = (map: GameMap): Vector => {
  for(const row in map) {
    for(const col in map[row]) {
      if (map[row][col] === 'S') {
        return { row: parseInt(row), col: parseInt(col) }
      }
    }
  }
  return { row: 0, col: 0 }
}
const step = (beam: Vector, map: GameMap): Vector[] => {
  const nextLoaction: Vector = { row: beam.row + 1, col: beam.col }
  if(!map[nextLoaction.row]) {
    // this will happen when we go off the bottom of the screen
    // the bottom row never contains splitters
    return [beam]
  }

  if(map[nextLoaction.row][nextLoaction.col] === '^') {
    return [
      { row: nextLoaction.row, col: nextLoaction.col + 1 },
      { row: nextLoaction.row, col: nextLoaction.col - 1 },
    ]
  }
  return [nextLoaction]
}

const partOne = (input: string): number => {
  const map = parseInput(input)
  const start = getStart(map)
  let beams: { [key:string]: Vector } = { [start.col]: start }
  let splitCount = 0
  for (const row of map) {
    const nextBeams = {}
    // this loop coincidentally matches the number of steps I need to take
    for (const beam of Object.values(beams)) {
      const stepResult = step(beam, map)

      if (stepResult.length === 2) {
        splitCount++
      }
      stepResult.forEach(element => nextBeams[element.col] = element);
    }
    beams = {...nextBeams}
  }
  return splitCount
}

const partTwo = (input: string): number => {
  const map = parseInput(input)
  const start = getStart(map)
  // since we always move down, I don't need to track the row on the paths.
  let paths = { [start.col]: 1 }
  for (const row in map) {
    const nextPaths = {}
    for (const col in paths) {
      const stepResult = step({ row: parseInt(row), col: parseInt(col) }, map)
      stepResult.forEach(nextStep =>
        nextPaths[nextStep.col] = (nextPaths[nextStep.col] ? nextPaths[nextStep.col] : 0) + paths[col]
      )
    }
    paths = {...nextPaths}

  }
  return Object.values(paths).reduce((carry, a) => carry + a, 0)
}

// console.log(partOne(testData))
console.log(partTwo(data))
