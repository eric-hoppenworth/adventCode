import data from './input.ts'
import testData from './test.ts'

const parseInput = (input: string): any => {
  return input.split('\n').map((line) => line.split(''))
}

const checkLine = (line: string) => {
  return (line.match(/XMAS/g)?.length || 0) + (line.match(/SAMX/g)?.length || 0)
}

const checkHorizontals = (grid: string[][]): number => {
  return grid.reduce((carry, line: string[]) => {
    return carry + checkLine(line.join(''))
  }, 0)
}

const checkVerticals = (grid: string[][]): number => {
  let count = 0
  const width = Math.max(grid[0].length, grid[grid.length - 1].length)
  for (let col = 0; col < width; col++) {
    let line = ''
    for (let row = 0; row < grid.length; row++) {
      if (grid[row][col]) {
        line += grid[row][col]
      }
    }
    count += checkLine(line)
  }
  return count
}

const checkLeftDiagnal = (grid: string[][]): number => {
  return checkVerticals(grid.map((line: string[], row) => {
    return Array(grid.length - 1 - row).concat(line)
  }))
}
const checkRightDiagnal = (grid: string[][]): number => {
  return checkVerticals(grid.map((line: string[], row) => {
    return Array(row).concat(line)
  }))
}

const partOne = (input: string): number => {
  const wordGrid = parseInput(input)
  return checkHorizontals(wordGrid) +
    checkVerticals(wordGrid) +
    checkLeftDiagnal(wordGrid) +
    checkRightDiagnal(wordGrid)
}
const partTwo = (input: string): number => {
  const grid = parseInput(input)
  let count = 0
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col]
      const leftCheck: string[] = []
      const rightCheck: string[] = []
      if (cell !== 'A') {
        continue
      }
      if (grid[row - 1] && grid[row - 1][col - 1]) {
        leftCheck.push(grid[row - 1][col - 1])
      }
      if (grid[row + 1] && grid[row + 1][col + 1]) {
        leftCheck.push(grid[row + 1][col + 1])
      }
      if (!(leftCheck.includes('M') && leftCheck.includes('S'))) {
        continue
      }
      if (grid[row - 1] && grid[row - 1][col + 1]) {
        rightCheck.push(grid[row - 1][col + 1])
      }
      if (grid[row + 1] && grid[row + 1][col - 1]) {
        rightCheck.push(grid[row + 1][col - 1])
      }
      if (!(rightCheck.includes('M') && rightCheck.includes('S'))) {
        continue
      }
      count++
    }
  }
  // go through the grid, looking for "A".
  // for each "A" see if the top left and bottom right options are "M and S"
  // if it is, check that the bottom left and top right options are "M and S"
  return count
}

// console.log(partOne(data))
console.log(partTwo(data))
