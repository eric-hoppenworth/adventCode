import data from './input.ts'
import testData from './test.ts'

type Vector = {
  row: number
  col: number
}

type Octopus = number
type Board = Octopus[][]

const parseInput = (input: string): Board => {
  return input.split('\n').map((line: string): Octopus[] => line.split('').map((octo: string): Octopus => parseInt(octo, 10)))
}
const getMapValue = (map: Board, position: Vector): number => {
  return (!map[position.row] || map[position.row][position.col] === undefined) ? -Infinity : map[position.row][position.col]
}
const addVectors = (a: Vector, b:Vector): Vector => {
  return {
    row: a.row + b.row,
    col: a.col + b.col,
  }
}
const directions: Vector[] = [
  { row: -1, col: -1 },
  { row: -1, col: 0 },
  { row: -1, col: 1 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
  { row: 1, col: -1 },
  { row: 1, col: 0 },
  { row: 1, col: 1 },
]

const doStep = (board: Board): [Board, number] => {
  let flashCount = 0
  const flashQueue: Vector[] = []
  board = board.map((row: Octopus[], rowIndex: number) => row.map((octo: Octopus, colIndex: number) => {
    if (octo >= 9) {
      const location = {
        row: rowIndex,
        col: colIndex,
      }
      flashQueue.push(location)
      return -Infinity
    }
    return octo + 1
  }))

  while(flashQueue.length) {
    const checkLocation = flashQueue.pop()
    if (!checkLocation) {
      continue
    }
    // increase each octopus in all directions. if this increase would result in 9+, add it to queue
    directions.forEach((vector: Vector) => {
      const newLocation = addVectors(vector, checkLocation)
      const value = getMapValue(board, newLocation)
      if (value >= 9) {
        flashQueue.push(newLocation)
        board[newLocation.row][newLocation.col] = -Infinity
      } else if (value >= 0) {
        board[newLocation.row][newLocation.col] = value + 1
      }
    });
  }

  // now I can map over the board again to count up the `-Infinity`s and reset those to zero
  board = board.map((row: Octopus[]) => row.map((octo: Octopus) => {
    if (octo === -Infinity) {
      flashCount++
      return 0
    }
    return octo
  }))
  return [board, flashCount]
}

const boardSum = (board: Board): number => {
  return board.reduce((rowTotal: number, row:Octopus[]) => rowTotal + row.reduce((carry: number, octo: number) => carry + octo, 0), 0)
}

const partOne = (board: Board, stepCount: number): number => {
  let totalFlashes = 0
  let flashCount
  for (let step = 0; step < stepCount; step++) {
    [board, flashCount] = doStep(board)
    totalFlashes += flashCount
    console.log(board.map(a => a.join('')).join('\n'))
    console.log('\n')
  }
  return totalFlashes
}

const partTwo = (board: Board): number => {
  let step = 0
  while(boardSum(board)) {
    step++
    [board] = doStep(board)
  }
  return step
}

// console.log(partOne(parseInput(data), 100))
console.log(partTwo(parseInput(data)))
