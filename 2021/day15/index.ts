import data from './input.ts'
import testData from './test.ts'

type Vector = {
  row: number
  col: number
}

type Board = number[][]

type PositionQueue = Vector[]
const addVectors = (a: Vector, b:Vector): Vector => {
  return {
    row: a.row + b.row,
    col: a.col + b.col,
  }
}
const getBoardValue = (board: Board, position: Vector, defaultVal = 0): number => {
  return (!board[position.row] || !board[position.row][position.col]) ? defaultVal : board[position.row][position.col]
}
const markBoard = (board: Board, position: Vector, value: number) => {
  if (!board[position.row]) {
    board[position.row] = []
  }
  board[position.row][position.col] = value
}

const parseInput = (input: string): Board => {
  return input.split('\n').map(row => row.split('').map(cell => parseInt(cell, 10)))
}
const getPathRiskBoard = (riskBoard: Board, start: Vector): Board => {
  const directions: Vector[] = [{ row: 1, col: 0 }, { row: -1, col: 0 }, { row: 0, col: 1 }, { row: 0, col: -1 }]

  const resultBoard: Board = [[0]]
  const queue: PositionQueue = [start]
  for (const myPostion of queue) {
    const myRisk = getBoardValue(resultBoard, myPostion)
    for (const direction of directions) {
      const checkPosition: Vector = addVectors(myPostion, direction)
      // find the risk for this location
      const risk = getBoardValue(riskBoard, checkPosition)
      if (!risk) {
        continue
      }
      // find the current total risk for that location
      const totalRisk = risk + myRisk
      const currentSmallestRisk = getBoardValue(resultBoard, checkPosition, Infinity)
      if (totalRisk < currentSmallestRisk) {
        markBoard(resultBoard, checkPosition, totalRisk)
        queue.push(checkPosition)
      }
    }
  }

  return resultBoard
}
const incrementBoard = (riskBoard: Board): Board => {
  return riskBoard.map(row => row.map(cell => ((cell) % 9) + 1))
}
const joinRight = (boardA:Board, boardB: Board): Board => {
  return boardA.map((row, index) => row.concat(boardB[index]))
}
const joinDown = (boardA:Board, boardB: Board): Board => {
  return boardA.concat(boardB)
}
const expandBoard = (board: Board): Board => {
  let previousBlock = board
  let newBoard = previousBlock
  for (let i = 0; i < 4; i++) {
    const currentBlock = incrementBoard(previousBlock)
    previousBlock = currentBlock
    newBoard = joinRight(newBoard, currentBlock)
  }

  previousBlock = newBoard
  for (let i = 0; i < 4; i++) {
    const currentBlock = incrementBoard(previousBlock)
    previousBlock = currentBlock
    newBoard = joinDown(newBoard, currentBlock)
  }
  return newBoard
}

const partOne = (riskBoard: Board): number => {
  const startingLocation: Vector = {
    row: 0,
    col: 0,
  }
  const pathBoard = getPathRiskBoard(riskBoard, startingLocation)
  const endingLocation: Vector = {
    row: riskBoard.length - 1,
    col: riskBoard[0].length - 1,
  }
  return (pathBoard[endingLocation.row] || [])[endingLocation.col] || 0
}

const partTwo = (riskBoard: Board): number => {
  const newBoard = expandBoard(riskBoard)
  const startingLocation: Vector = {
    row: 0,
    col: 0,
  }
  const pathBoard = getPathRiskBoard(newBoard, startingLocation)
  const endingLocation: Vector = {
    row: newBoard.length - 1,
    col: newBoard[0].length - 1,
  }
  return (pathBoard[endingLocation.row] || [])[endingLocation.col] || 0
}
// console.log(partOne(parseInput(testData)))
console.log(partTwo(parseInput(data)))
