import data from './input.ts'
import testData from './test.ts'

const WALKABLE = '.'
const WALL = '#'

type Grid = Record<number, Record<number, string>>
type Command = number | 'L' | 'R'
type MoveList = Command[]

type Range = {
  min: number;
  max: number;
}

type PuzzleInput = {
  map: Grid;
  moveList: MoveList;
}

type GridRange = {
  [key: number]: Range
}

type Vector = {
  row: number;
  col: number;
}
enum Direction {
  Down = 'D',
  Right = 'R',
  Left = 'L',
  Up = 'U',
}

type Player = {
  position: Vector;
  direction: Direction;
}

const directionMap = {
  [Direction.Up]: {
    L: Direction.Left,
    R: Direction.Right,
    vector: { row: -1, col: 0 },
  },
  [Direction.Down]: {
    L: Direction.Right,
    R: Direction.Left,
    vector: { row: 1, col: 0 },
  },
  [Direction.Left]: {
    L: Direction.Down,
    R: Direction.Up,
    vector: { row: 0, col: -1 },
  },
  [Direction.Right]: {
    L: Direction.Up,
    R: Direction.Down,
    vector: { row: 0, col: 1 },
  },
}

const parseInput = (input: string): PuzzleInput => {
  const [mapString, directionString] = input.split('\n\n')
  const map: Grid = {}
  mapString.split('\n').forEach((line, row) => {
    line.split('').forEach((cell, col) => {
      if (cell === WALKABLE || cell === WALL) {
        if (!map[row + 1]) {
          map[row + 1] = {}
        }
        map[row + 1][col + 1] = cell
      }
    })
  })
  const distances = directionString.split(/[LR]/g).map(a => parseInt(a, 10))
  const turns = directionString.split(/[\d]+/g).filter(Boolean)
  const moveList: MoveList = []
  distances.forEach((value, index) => {
    moveList.push(value)
    if (turns[index]) {
      moveList.push(turns[index] as 'L' | 'R')
    }
  })
  return {
    map,
    moveList,
  }
}

const getGridRanges = (map: Grid): { row: GridRange, col: GridRange } => {
  const rowRange: GridRange = {}
  const colRange: GridRange = {}
  for (const rowKey in map) {
    const row = parseInt(rowKey, 10)
    let maxCol = -Infinity
    let minCol = Infinity
    for (const colKey in map[row]) {
      const col = parseInt(colKey, 10)
      if (col < minCol) {
        minCol = col
      }
      if (col > maxCol) {
        maxCol = col
      }
    }
    rowRange[row] = { min: minCol, max: maxCol }
  }
  const firstCol = Math.min(...Object.values(rowRange).map(a => a.min))
  const lastCol = Math.max(...Object.values(rowRange).map(a => a.max))

  for (let col = firstCol; col <= lastCol; col++) {
    const rows = Object.entries(rowRange)
      .filter(([row, range]) => {
        return range.min <= col && range.max >= col
      })
      .map(([row, range]) => parseInt(row, 10))
    colRange[col] = {
      min: Math.min(...rows),
      max: Math.max(...rows),
    }
  }

  return {
    row: rowRange,
    col: colRange,
  }
}

const doMove = (map: Grid, ranges: { row: GridRange, col: GridRange }, player: Player, command: Command): Player => {
  if (typeof command === 'number') {
    const velocity = directionMap[player.direction].vector
    for (let i = 0; i < command; i++) {
      const newPostion = {
        row: player.position.row + velocity.row,
        col: player.position.col + velocity.col,
      }

      if (velocity.row) {
        if (newPostion.row > ranges.col[player.position.col].max) {
          newPostion.row = ranges.col[player.position.col].min
        }
        if (newPostion.row < ranges.col[player.position.col].min) {
          newPostion.row = ranges.col[player.position.col].max
        }
      }

      if (velocity.col) {
        if (newPostion.col > ranges.row[player.position.row].max) {
          newPostion.col = ranges.row[player.position.row].min
        }
        if (newPostion.col < ranges.row[player.position.row].min) {
          newPostion.col = ranges.row[player.position.row].max
        }
      }


      if (map[newPostion.row][newPostion.col] === WALKABLE) {
        player.position = newPostion
      } else {
        break
      }
    }
  }
  if (command === 'L' || command === 'R') {
    // change my own direction
    player.direction = directionMap[player.direction][command]
  }
  return player
}

const getScore = (player: Player): number => {
  const directionScore = {
    [Direction.Right]: 0,
    [Direction.Down]: 1,
    [Direction.Left]: 2,
    [Direction.Up]: 3,
  }
  return player.position.row * 1000 + player.position.col * 4 + directionScore[player.direction]
}

const partOne = (input: string): number => {
  const { map, moveList } = parseInput(input)
  const ranges = getGridRanges(map)
  const player = {
    position: { row: 1, col: ranges.row[1].min },
    direction: Direction.Right,
  }
  for (const command of moveList) {
    doMove(map, ranges, player, command)
  }
  return getScore(player)
}


console.log(partOne(data))
