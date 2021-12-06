import data from './input.ts'
import testData from './test.ts'

type Vector = {
  row: number;
  col: number;
}

type Line = {
  a: Vector;
  b: Vector;
}

type Board = {
  [row: number]: {
    [col: number]: number
  }
}
type BoardLineTransformer = (line: Line, board: Board) => Board
enum LineType {
  HORIZONTAL,
  VERTICAL,
  DIAGONAL,
}

const parseInput = (inputString: string): Line[] => {
  return inputString.split('\n').map((v: string): Line => {
    const vectors: string[] = v.split(' -> ')
    return {
      a: {
        row: parseInt(vectors[0].split(',')[0]),
        col: parseInt(vectors[0].split(',')[1]),
      },
      b: {
        row: parseInt(vectors[1].split(',')[0]),
        col: parseInt(vectors[1].split(',')[1]),
      },
    }
  })
}

const getLineType = (line: Line) => {
  if (line.a.row === line.b.row) {
    return LineType.HORIZONTAL
  }
  if (line.a.col === line.b.col) {
    return LineType.VERTICAL
  }
  return LineType.DIAGONAL
}

const markBoardLinePartOne: BoardLineTransformer = (line: Line, board:Board): Board =>
  getLineType(line) === LineType.DIAGONAL ? board : markBoardLinePartTwo(line, board)

const markBoardLinePartTwo: BoardLineTransformer = (line: Line, board:Board): Board => {
  const dRow: number = line.a.row === line.b.row ? 0 :
    line.a.row > line.b.row ? -1 : 1
  const dCol: number = line.a.col === line.b.col ? 0 :
    line.a.col > line.b.col ? -1 : 1
  let step: number = 0
  while (
    (line.a.row + (dRow * step) !== line.b.row) ||
    (line.a.col + (dCol * step) !== line.b.col)
  ) {
    board = markBoardVector({
      row: line.a.row + (dRow * step),
      col: line.a.col + (dCol * step),
    }, board)
    step++
  }
  return markBoardVector({
    row: line.b.row,
    col: line.b.col,
  }, board)
}

const markBoardVector = (vector: Vector, board: Board): Board => {
  if (!board[vector.row]) {
    board[vector.row] = {}
  }
  if (!board[vector.row][vector.col]) {
    board[vector.row][vector.col] = 0
  }
  board[vector.row][vector.col]++
  return board
}

const scoreBoard = (board: Board): number => {
  let score = 0
  for (const row in board) {
    for (const col in board[row]) {
      score += board[row][col] > 1 ? 1 : 0
    }
  }
  return score
}


const main = (lines: Line[], markBoardLine: BoardLineTransformer): number => {
  let board = {}
  for (let i = 0; i < lines.length; i++) {
    board = markBoardLine(lines[i], board)
  }
  return scoreBoard(board)
}

console.log(main(parseInput(data), markBoardLinePartOne))
console.log(main(parseInput(data), markBoardLinePartTwo))
