import data from './input.ts'
import testData from './test.ts'

type Vertex = {
  row: number;
  col: number;
}
type Shape = Vertex[]
type Cave = string[][]
type CaveDetail = {
  cave: Cave;
  sandStart: Vertex;
}
const ROCK = '#'
const AIR = '.'
const SAND = 'o'
const SAND_START = '+'

const DOWN: Vertex = { row: 1, col: 0 }
const DOWN_LEFT: Vertex = { row: 1, col: -1 }
const DOWN_RIGHT: Vertex = { row: 1, col: 1 }

const addPositions = (a: Vertex, b: Vertex): Vertex => ({ row: a.row + b.row, col: a.col + b.col })
const parseInput = (input: string): Shape[] => {
  return input.split('\n').map((line): Shape => {
    return line.split(' -> ').map((v) => {
      const [col, row] = v.split(',')
      return {
        row: parseInt(row, 10),
        col: parseInt(col, 10),
      }
    })
  })
}
const getAllLocations = (shape: Shape): Vertex[] => {
  const locations: Vertex[] = []
  for (let i = 1; i < shape.length; i++) {
    const a = shape[i-1]
    const b = shape[i]
    if (a.row === b.row) {
      for (let col = a.col; col !== b.col; col = col + (a.col < b.col ? 1 : -1)) {
        locations.push({ row: a.row, col })
      }
    }
    if (a.col === b.col) {
      for (let row = a.row; row !== b.row; row = row + (a.row < b.row ? 1 : -1)) {
        locations.push({ row, col: a.col })
      }
    }
  }
  locations.push(shape[shape.length - 1])
  return locations
}

const getCave = (shapes: Shape[]): CaveDetail => {
  let maxRow = -Infinity
  const locations = shapes.map(getAllLocations).flat()
  for (const vertex of locations) {
    if (vertex.row > maxRow) {
      maxRow = vertex.row
    }
  }
  // sort of arbitrarily increase each by one to give some spacing
  const minCol = 500 - maxRow * 2
  const maxCol = 500 + maxRow * 2
  maxRow = maxRow + 1
  const cave: Cave = []
  for (let row = 0; row <= maxRow; row++) {
    cave.push([])
    for (let col = minCol; col <= maxCol; col++) {
      cave[row].push(AIR)
    }
  }
  for (const location of locations) {
    const col = location.col - minCol
    cave[location.row][col] = ROCK
  }
  const sandStart = { row: 0, col: 500 - minCol }
  cave[sandStart.row][sandStart.col] = SAND_START
  return {
    cave,
    sandStart,
  }
}

const produceSand = (caveDetail: CaveDetail) => {
  let sandStopped = false
  let sandLocation = { ...caveDetail.sandStart }
  while(!sandStopped) {
    for (const direction of [DOWN, DOWN_LEFT, DOWN_RIGHT]) {
      let checkLocation = addPositions(sandLocation, direction)
      // if I am off the edge of the cave, then it's game over and I have my final answer(?)
      if (!caveDetail.cave[checkLocation.row] || !caveDetail.cave[checkLocation.row][checkLocation.col]) {
        return false
      }
      if (caveDetail.cave[checkLocation.row][checkLocation.col] === AIR) {
        sandLocation = checkLocation
        break // break out of the direction loop, but not the while loop
      }
      if (direction === DOWN_RIGHT) {
        sandStopped = true
      }
    }
  }
  if (caveDetail.cave[sandLocation.row][sandLocation.col] === SAND_START) {
    return false
  }
  caveDetail.cave[sandLocation.row][sandLocation.col] = SAND
  return true
}

const printCave = (cave: Cave) => console.log(cave.map(r => r.join('')).join('\n') + '\n')
const partOne = (input: string): number => {
  const shapes = parseInput(input)
  const caveDetail = getCave(shapes)
  printCave(caveDetail.cave)
  let count = 0
  while(produceSand(caveDetail)) {
    printCave(caveDetail.cave)
    count++
  }
  return count
}

const partTwo = (input: string): number => {
  const shapes = parseInput(input)
  const caveDetail = getCave(shapes)
  caveDetail.cave.push(caveDetail.cave[0].map(() => ROCK))
  printCave(caveDetail.cave)
  let count = 1
  while(produceSand(caveDetail)) {
    // printCave(caveDetail.cave)
    count++
  }
  printCave(caveDetail.cave)
  return count
}
// console.log(partOne(data))
console.log(partTwo(data))
