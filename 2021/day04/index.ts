import data from './input.ts'
import testData from './test.ts'

type Board = string[][]

type ParsedInput = {
  calls: string[];
  boards: Board[];
}
const MARKED_CHARACTER = ''

const parseInput = (input:string): ParsedInput => {
  return {
    calls: input.slice(0, input.indexOf('\n\n')).split(','),
    boards: input
      .slice(input.indexOf('\n\n') + 2)
      .split('\n\n')
      .map((element: string) =>
        element
          .split('\n')
          .map((row:string) => row.split(' ').filter(Boolean))
      ),
  }
}


const markBoard = (board: Board, callNumber: string): Board => {
  return board.map((row: string[]) => row.map((cell: string) => cell === callNumber ? MARKED_CHARACTER : cell))
}
const checkBoard = (board: Board): boolean => {
  // if any row is all marked,
  for (let rowNumber = 0; rowNumber < board.length; rowNumber++) {
    const row = board[rowNumber]
    let rowWins = true
    for (let columnNumber = 0; columnNumber < row.length; columnNumber++) {
      const cell = row[columnNumber]
      if (cell !== MARKED_CHARACTER) {
        rowWins = false
        break
      }
    }
    if (rowWins) {
      return true
    }
  }
  // or if any column is all marked
  for (let columnNumber = 0; columnNumber < board[0].length; columnNumber++) {
    let columnWins = true
    for (let rowNumber = 0; rowNumber < board.length; rowNumber++) {
      const cell = board[rowNumber][columnNumber]
      if (cell !== MARKED_CHARACTER) {
        columnWins = false
        break
      }
    }
    if (columnWins) {
      return true
    }
  }
  return false
}
const scoreBoard = (board: Board): number => {
  return board.reduce((boardTotal: number, row: string[]) => {
    return boardTotal + row.reduce((rowTotal: number, cell: string) => rowTotal + (cell === MARKED_CHARACTER ? 0 : parseInt(cell, 10)), 0)
  }, 0)
}

const partOne = ({ calls, boards }: ParsedInput): number => {
  if (!calls.length) {
    return 0 // 'impossible' state based on game rules
  }
  const [callNumber, ...restCalls] = calls
  const markedBoards = boards.map((board: Board) => {
    return markBoard(board, callNumber)
  })
  const winningBoard = markedBoards.find(checkBoard)
  if (winningBoard) {
    return scoreBoard(winningBoard) * parseInt(callNumber, 10)
  }
  return partOne({ calls: restCalls, boards: markedBoards })
}

const partTwo = ({ calls, boards }: ParsedInput): number => {
  if (!calls.length) {
    return 0 // 'impossible' state based on game rules
  }
  const [callNumber, ...restCalls] = calls
  const markedBoards = boards.map((board: Board) => {
    return markBoard(board, callNumber)
  })

  const nonWinningBoards = markedBoards.filter((board: Board) => !checkBoard(board))
  if (nonWinningBoards.length === 1) {
    return partOne({ calls: restCalls, boards: nonWinningBoards })
  }
  return partTwo({ calls: restCalls, boards: nonWinningBoards })
}


// console.log(partOne(parseInput(data)))
console.log(partTwo(parseInput(data)))
