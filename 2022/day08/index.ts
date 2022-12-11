import data from './input.ts'
import testData from './test.ts'

type Grid<T> = Row<T>[]
type Row<T> = T[]
type Location = {
  row: number;
  col: number;
}


const parseInput = (input: string): Grid<number> => {
  return input.split('\n').map(r => r.split('').map(a => parseInt(a, 10)))
}

const checkFromLeft = (grid: Grid<number>) => {
  const result: Grid<boolean> = []
  for (const row in grid) {
    const gridRow = grid[row]
    result.push([])

    let maxHeight = -Infinity
    for (const col in gridRow) {
      const cell = gridRow[col]
      if (cell > maxHeight) {
        maxHeight = cell
        result[row][col] = true
      } else {
        result[row][col] = false
      }
    }
  }
  return result
}
const checkFromRight = (grid: Grid<number>) => {
  const result: Grid<boolean> = []
  for (let row = 0; row < grid.length; row++) {
    const gridRow = grid[row]
    result.push([])
    let maxHeight = -Infinity
    for (let col = grid.length - 1; col >= 0; col--) {
      const cell = gridRow[col]
      if (cell > maxHeight) {
        maxHeight = cell
        result[row][col] = true
      } else {
        result[row][col] = false
      }
    }
  }
  return result
}

const checkFromTop = (grid: Grid<number>): Grid<boolean> => {
  const result: Grid<boolean> = []
  for (let col = 0; col < grid.length; col++) {
    let maxHeight = -Infinity
    for (let row = 0; row < grid.length; row++) {
      if (!result[row]) {
        result[row] = []
      }
      const cell = grid[row][col]
      if (cell > maxHeight) {
        maxHeight = cell
        result[row][col] = true
      } else {
        result[row][col] = false
      }
    }
  }
  return result
}
const checkFromBottom = (grid: Grid<number>): Grid<boolean> => {
  const result: Grid<boolean> = []
  for (let col = 0; col < grid.length; col++) {
    let maxHeight = -Infinity
    for (let row = grid.length - 1; row >= 0; row--) {
      if (!result[row]) {
        result[row] = []
      }
      const cell = grid[row][col]
      if (cell > maxHeight) {
        maxHeight = cell
        result[row][col] = true
      } else {
        result[row][col] = false
      }
    }
  }
  return result
}

const lookUp = (grid: Grid<number>, location: Location): number => {
  const myTreeValue: number = grid[location.row][location.col] as number
  let count = 0
  for (let row = location.row - 1; row >= 0; row--) {
    const checkTree = grid[row][location.col]
    count++
    if (checkTree >= myTreeValue) {
      break
    }
  }
  return count
}
const lookDown = (grid: Grid<number>, location: Location): number => {
  const myTreeValue: number = grid[location.row][location.col] as number
  let count = 0
  for (let row = location.row + 1; row < grid.length; row++) {
    const checkTree = grid[row][location.col]
    count++
    if (checkTree >= myTreeValue) {
      break
    }
  }
  return count
}
const lookLeft = (grid: Grid<number>, location: Location): number => {
  const myTreeValue: number = grid[location.row][location.col] as number
  let count = 0
  for (let col = location.col - 1; col >= 0; col--) {
    const checkTree = grid[location.row][col]
    count++
    if (checkTree >= myTreeValue) {
      break
    }
  }
  return count
}
const lookRight = (grid: Grid<number>, location: Location): number => {
  const myTreeValue: number = grid[location.row][location.col] as number
  let count = 0
  for (let col = location.col + 1; col < grid.length; col++) {
    const checkTree = grid[location.row][col]
    count++
    if (checkTree >= myTreeValue) {
      break
    }
  }
  return count
}


const checkLocation = (grid: Grid<number>, location: Location): number => {
  return lookUp(grid, location) * lookDown(grid, location) * lookLeft(grid, location) * lookRight(grid, location)
}

const partOne = (input: string): number => {
  const grid = parseInput(input)
  const leftGrid = checkFromLeft(grid)
  const rightGrid = checkFromRight(grid)
  const topGrid = checkFromTop(grid)
  const bottomGrid = checkFromBottom(grid)

  const finalGrid = leftGrid.map((_, row) => _.map((__, col) => leftGrid[row][col] || rightGrid[row][col] || topGrid[row][col] || bottomGrid[row][col] ))
  return finalGrid.flat().filter(Boolean).length
}

const partTwo = (input: string): number => {
  const grid = parseInput(input)
  let maxScore = 0
  // when I go through the grid, don't bother checking the edges
  for (let row = 1; row < grid.length - 1; row++) {
    for (let col = 1; col < grid.length - 1; col++) {
      const location = { row, col }
      const score = checkLocation(grid, location)
      if (score > maxScore) {
        maxScore = score
      }
    }
  }
  return maxScore
}

// console.log(partOne(data))
console.log(partTwo(data))
