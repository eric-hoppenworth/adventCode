import data from './input.ts'
import testData from './test.ts'

type Vector = {
  row: number;
  col: number;
}

const parseInput = (input: string): any => {
  return input.split('\n')
}

const checkLocation = (grid: string[], location: Vector): boolean => {
  if (!grid[location.row] || grid[location.row][location.col] !== '@') {
    return false
  }
  // if it is a roll, check the 8 locations around. once I have 4, return false
  let adjacentChecks = 0
  for (let rowChange = -1; rowChange <= 1; rowChange++) {
    for (let colChange = -1; colChange <= 1; colChange++) {
      if (rowChange === 0 && colChange === 0) {
        continue
      }
      if (!grid[location.row + rowChange]) {
        continue
      }
      if (grid[location.row + rowChange][location.col + colChange] === '@') {
        adjacentChecks++
      }
      if (adjacentChecks === 4) {
        return false
      }
    }
  }
  return true
}

const partOne = (input: string): number => {
  const grid = parseInput(input)
  let result = 0
  for (const row in grid) {
    for (const col in grid[row]) {
      result += checkLocation(grid, { row: parseInt(row), col: parseInt(col) }) ? 1 : 0
    }
  }
  return result
}

const partTwo = (input: string): number => {
  const grid = parseInput(input)
  let result = 0
  let changeOccuredThisLoop = true
  while(changeOccuredThisLoop) {
    changeOccuredThisLoop = false
    for (const row in grid) {
      for (const col in grid[row]) {
        const location = { row: parseInt(row), col: parseInt(col) }
        if (checkLocation(grid, location)) {
          grid[location.row] = grid[location.row].slice(0, location.col) + "." + grid[location.row].slice(location.col + 1)
          changeOccuredThisLoop = true
          result += 1
        }
      }
    }
  }

  return result
}

// console.log(partOne(data))
console.log(partTwo(data))
