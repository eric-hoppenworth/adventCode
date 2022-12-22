import data from './input.ts'
import testData from './test.ts'
type Position = {
  row: number;
  col: number;
}

enum Direction {
  Down = 'D',
  Right = '>',
  Left = '<',
}
const ROCK = '#'
const NILL = '.'

type Cave = {
  static: Position[],
  rock: Position[],
}

const addPositions = (a: Position, b: Position): Position => ({ row: a.row + b.row, col: a.col + b.col })
const directionMap: { [key in Direction]: Position } = {
  [Direction.Down]: { row: -1, col: 0 },
  [Direction.Right]: { row: 0, col: 1 },
  [Direction.Left]: { row: 0, col: -1 },
}

const rocks: Position[][] = [
  [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }],
  [{ row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 2, col: 1 }],
  [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }],
  [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 3, col: 0 }],
  [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }]
]

class Queue<T> {
  private list: T[]
  private index: number
  private count: number
  constructor(list: T[]) {
    this.list = list
    this.index = -1
    this.count = 0
  }
  public getNext() {
    this.count++
    this.index = this.index + 1
    if (this.index === this.list.length) {
      this.index = 0
    }
    return this.list[this.index]
  }
  public getCount() {
    return this.count
  }
}

const parseInput = (input: string): Direction[] => {
  return input.split('') as Direction[]
}

const printMap = (cave: Cave) => {
  const positions = cave.static.concat(cave.rock)
  const maxRow = Math.max(...positions.map(a => a.row))
  const result: string[][] = []
  for (let row = 0; row <= maxRow; row++) {
    result.push([])
    for (let col = 0; col < 7; col++) {
      result[row].push(NILL)
    }
  }
  for (const { row, col } of positions) {
    result[row][col] = ROCK
  }
  for (const row of result) {
    if (row.join('') === '#######') {
      console.log('got a full row!')
    }
  }
  // console.log(result.reverse().map(a => a.join('')).join('\n'))
}

const moveRock = (cave: Cave, vector: Position): boolean => {
  const newRockPositions = cave.rock.map(a => addPositions(a, vector))
  for (const position of newRockPositions) {
    if (position.col < 0 || position.col > 6) {
      return false
    }
  }
  const caveMap: { [row: number]: { [col: number]: boolean } } = {}
  for (const position of cave.static.concat(newRockPositions)) {
    if (!caveMap[position.row]) {
      caveMap[position.row] = {}
    }
    if (caveMap[position.row][position.col]) {
      return false
    }
    caveMap[position.row][position.col] = true
  }
  cave.rock = newRockPositions
  return true
}

const partOne = (input: string, totalRows: number): number => {
  const jets = new Queue(parseInput(input))
  const rockQueue = new Queue(rocks)
  const room: Position[] = []
  for (let col = 0; col < 7; col++) {
    room.push({ row: 0, col })
  }
  const cave = {
    static: room,
    rock: rockQueue.getNext(),
  }
  while (rockQueue.getCount() <= totalRows) {
    const maxRow = Math.max(...cave.static.map(a => a.row))
    cave.rock = cave.rock.map((location): Position => addPositions(location, { row: maxRow + 4, col: 2 }))
    while (true) {
      moveRock(cave, directionMap[jets.getNext()])
      const movedY = moveRock(cave, directionMap[Direction.Down])
      if (!movedY) {
        cave.static = cave.static.concat(cave.rock).slice(-100) // this slice speeds things up. 100 is arbitrary
        cave.rock = rockQueue.getNext()
        break
      }
    }
  }
  printMap(cave)
  return Math.max(...cave.static.map(a => a.row))
}
// 1000000000000
// console.log(partOne(testData, 200))
console.log(partOne(testData, 400))
// console.log(partOne(testData, 600))
console.log(partOne(testData, 800))
// console.log(partOne(testData, 1000))
console.log(partOne(testData, 1200))
// console.log(partOne(testData, 1400))
console.log(partOne(testData, 1600))
// console.log(partOne(testData, 1800))
console.log(partOne(testData, 2000))
// console.log(partOne(testData, 1000000000000))
