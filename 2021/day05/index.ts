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

const markBoardLine = (line: Line, board:Board): Board => {
  const lineType = getLineType(line)
  if (lineType === LineType.HORIZONTAL) {
    const startPoint = line.a.col < line.b.col ? line.a : line.b
    const endPoint = line.a.col < line.b.col ? line.b : line.a
    for (let i = startPoint.col; i <= endPoint.col; i++) {
      board = markBoardVector({
        row: startPoint.row,
        col: i,
      }, board)
    }
    return board
  }
  if (lineType === LineType.VERTICAL) {
    const startPoint = line.a.row < line.b.row ? line.a : line.b
    const endPoint = line.a.row < line.b.row ? line.b : line.a
    for (let i = startPoint.row; i <= endPoint.row; i++) {
      board = markBoardVector({
        row: i,
        col: startPoint.col,
      }, board)
    }
    return board
  }
  if (lineType === LineType.DIAGONAL) {
    return board
  }
  return board
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

const lines = parseInput(testData)
console.log(markBoardLine(lines[0], {}))
