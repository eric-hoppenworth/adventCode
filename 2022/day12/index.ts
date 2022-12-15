import data from './input.ts'
import testData from './test.ts'

type Position = {
  row: number;
  col: number;
}
type Grid = number[][]

type Map = {
  grid: Grid;
  start: Position;
  end: Position;
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
const addPositions = (a: Position, b: Position): Position => ({ row: a.row + b.row, col: a.col + b.col })
const getGridValue = (grid: Grid, p: Position, defaultValue = Infinity): number => grid[p.row] ? (grid[p.row][p.col] ?? defaultValue) : defaultValue
const parseInput = (input: string): Map => {
  let start = { row: 0, col: 0 }
  let end = { row: 0, col: 0 }
  const grid = input.split('\n').map((line, row) => line.split('').map((char: string, col) => {
    if (char === 'S') {
      start = { row, col }
      char = 'a'
    }
    if (char === 'E') {
      end = { row, col }
      char = 'z'
    }
    return char.charCodeAt(0) - 96
  }))
  return {
    start,
    end,
    grid,
  }
}

const doPathing = (map: Map, elevationCheck: (current: number, next: number) => boolean, defaultValue: number = Infinity): Grid => {
  const stepGrid: Grid = map.grid.map(_ => _.map(() => 0))
  const queue: Position[] = [map.start]
  while(queue.length) {
    const position = queue.pop() as Position
    const currentElevation = getGridValue(map.grid, position, defaultValue)
    const currentStep = getGridValue(stepGrid, position, defaultValue)
    Object.values(directionMap).forEach(direction => {
      const newPosition = addPositions(position, direction)
      const nextElevation = getGridValue(map.grid, newPosition, defaultValue)
      if (elevationCheck(currentElevation, nextElevation)) {
        // i can step there, but I only want to if my step count is LOWER than the existing one
        const existingStep = getGridValue(stepGrid, newPosition, defaultValue)
        if (existingStep > currentStep + 1 || existingStep === 0) {
          stepGrid[newPosition.row][newPosition.col] = currentStep + 1
          queue.push(newPosition)
        }
      }
    })
  }
  return stepGrid
}

const printSteps = (grid: Grid) => console.log(grid.map((row) => row.map((a) => a.toString().padStart(4, ' ')).join('')).join('\n') + '\n')

const getMinStep = (elevationGrid: Grid, stepGrid: Grid, startingElevation = 1) => {
  let minStepCount = Infinity
  elevationGrid.forEach((gridRow, row) => {
    gridRow.forEach((cell, col) => {
      if (cell === startingElevation) {
        const stepCount = getGridValue(stepGrid, { row, col })
        if (stepCount && stepCount < minStepCount) {
          minStepCount = stepCount
        }
      }
    })
  })
  return minStepCount
}

const partOne = (input: string): number => {
  const map = parseInput(input)
  const stepGrid: Grid = doPathing(map, (current: number, next: number) => next <= current + 1)
  printSteps(stepGrid)
  return getGridValue(stepGrid, map.end)
}

const partTwo = (input: string): number => {
  const map = parseInput(input)
  const reverseMap = {
    ...map,
    start: map.end,
    end: map.start,
  }
  // we are going to path in reverse
  const stepGrid: Grid = doPathing(reverseMap, (current: number, next: number) => next > current || next === current || next === current - 1 , -Infinity)
  printSteps(stepGrid)
  return getMinStep(map.grid, stepGrid, 1)
}


// console.log(partOne(data))
console.log(partTwo(data))
