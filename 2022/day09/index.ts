import data from './input.ts'
import testData from './test.ts'
import testData2 from './test2.ts'

type Position = {
  row: number;
  col: number;
}
enum Direction {
  Down = 'D',
  Up = 'U',
  Right = 'R',
  Left = 'L',
}

const directionMap: { [key in Direction]: Position } = {
  [Direction.Down]: { row: -1, col: 0 },
  [Direction.Up]: { row: 1, col: 0 },
  [Direction.Right]: { row: 0, col: 1 },
  [Direction.Left]: { row: 0, col: -1 },
}

type Grid = {
  [key: number]: {
    [key: number]: boolean
  }
}
const parseInput = (input: string): Position[] => {
  const moves: Position[] = []
  input.split('\n').forEach((line: string) => {
    const parts = line.split(' ')
    const count = parseInt(parts[1], 10)
    for (let i = 0; i < count; i++) {
      moves.push(directionMap[parts[0] as Direction])
    }
  })
  return moves
}

const markLocation = (grid: Grid, location: Position) => {
  if (!grid[location.row]) {
    grid[location.row] = {}
  }
  grid[location.row][location.col] = true
}

const addPositions = (a: Position, b: Position): Position => ({ row: a.row + b.row, col: a.col + b.col })
const moveKnot = (a: Position, b: Position): Position => {
  const colDistance = a.col - b.col
  const rowDistance = a.row - b.row
  if (Math.abs(colDistance) === 2 && Math.abs(rowDistance) === 2) {
    return {
      row: (a.row + b.row) / 2,
      col: (a.col + b.col) / 2,
    }
  }
  if (Math.abs(colDistance) === 2) {
    return {
      row: a.row,
      col: (a.col + b.col) / 2,
    }
  }
  if (Math.abs(rowDistance) === 2) {
    return {
      row: (a.row + b.row) / 2,
      col: a.col,
    }
  }
  return { ...b }
}


const partOne = (input: string, knotCount: number = 1): number => {
  const moves = parseInput(input)
  const grid: Grid = { 0: { 0: true } }
  const rope: Position[] = []
  for (let i = 0; i < knotCount; i++) {
    rope.push({ row: 0, col: 0 })
  }
  for (const move of moves) {
    rope[0] = addPositions(rope[0], move)
    for(let i = 1; i < rope.length; i++) {
      rope[i] = moveKnot(rope[i-1], rope[i])

    }
    markLocation(grid, rope[rope.length - 1])
  }
  return Object.values(grid)
    .reduce(
      (carry: number, row) =>
        carry + Object.values(row).reduce((carry2: number) => carry2 + 1, 0)
      , 0
    )
}

console.log(partOne(data, 2))
console.log(partOne(data, 10))
