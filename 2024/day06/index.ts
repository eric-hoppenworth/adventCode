import data from './input.ts'
import testData from './test.ts'

type Vector = {
  row: number;
  col: number;
}

type Player = {
  location: Vector;
  direction: 'up' | 'down' | 'left' | 'right';
}
type OriginalObjects = {
  objectsByRow: Map<number, number[]>;
  objectsByCol: Map<number, number[]>;
}

type Game = {
  player: Player;
  vistedLocations: Set<string>;
  paths: string[];
  map: string[];
} & OriginalObjects

type StepResult = {
  exit: boolean;
  path: string;
}

const parseInput = (input: string): Game => {
  const map = input.split('\n')
  let player!: Player
  const objectsByRow: Map<number, number[]> = new Map()
  const objectsByCol: Map<number, number[]> = new Map()
  for (let row = 0; row < map.length; row++) {
    if (!objectsByRow.get(row)) {
      objectsByRow.set(row, [])
    }
    for (let col = 0; col < map[row].length; col++) {
      if (!objectsByCol.get(col)) {
        objectsByCol.set(col, [])
      }
      const cell = map[row][col]
      if (cell === '#') {
        // add it to both maps
        objectsByRow.get(row)!.push(col)
        objectsByCol.get(col)!.push(row)
      } else if (cell === '^') {
        player = {
          location: { row, col },
          direction: 'up',
        }
      }
    }
  }

  return {
    map,
    objectsByRow,
    objectsByCol,
    player,
    paths: [],
    vistedLocations: new Set<string>(),
  }
}
const up = (game: Game): StepResult => {
  let exit = false
  let checkObjects = game.objectsByCol.get(game.player.location.col)
  if (!checkObjects) {
    throw new Error()
  }
  checkObjects = [...checkObjects].reverse()
  let obstacle = checkObjects.find(a => a < game.player.location.row)
  if (!obstacle && obstacle !== 0) {
    exit = true
    obstacle = -1
  }
  let path = ''
  // for each space between player and obstacle (not including obstacle) add to the set.
  for (let row = game.player.location.row; row > obstacle; row--) {
    const locationString = `${row},${game.player.location.col}`
    game.vistedLocations.add(locationString)
    path += locationString + ";"
  }
  game.player.location.row = obstacle + 1
  game.player.direction = 'right'
  return { exit, path }
}
const left = (game: Game): StepResult => {
  let exit = false;
  let checkObjects = game.objectsByRow.get(game.player.location.row)
  if (!checkObjects) {
    throw new Error()
  }
  checkObjects = [...checkObjects].reverse()
  let obstacle = checkObjects.find(a => a < game.player.location.col)
  if (!obstacle && obstacle !== 0) {
    exit = true
    obstacle = -1
  }
  let path = ''
  // for each space between player and obstacle (not including obstacle) add to the set.
  for (let col = game.player.location.col; col > obstacle; col--) {
    const locationString = `${game.player.location.row},${col}`
    game.vistedLocations.add(locationString)
    path += locationString + ";"
  }
  game.player.location.col = obstacle + 1
  game.player.direction = 'up'
  return { exit, path }
}
const down = (game: Game): StepResult => {
  let exit = false
  const checkObjects = game.objectsByCol.get(game.player.location.col)
  if (!checkObjects) {
    throw new Error()
  }
  let obstacle = checkObjects.find(a => a > game.player.location.row)
  if (!obstacle && obstacle !== 0) {
    exit = true
    obstacle = game.map.length
  }
  let path = ''
  // for each space between player and obstacle (not including obstacle) add to the set.
  for (let row = game.player.location.row; row < obstacle; row++) {
    const locationString = `${row},${game.player.location.col}`
    game.vistedLocations.add(locationString)
    path += locationString + ";"
  }
  game.player.location.row = obstacle - 1
  game.player.direction = 'left'
  return { exit, path }
}
const right = (game: Game): StepResult => {
  let exit = false
  const checkObjects = game.objectsByRow.get(game.player.location.row)
  if (!checkObjects) {
    throw new Error()
  }
  let obstacle = checkObjects.find(a => a > game.player.location.col)
  if (!obstacle && obstacle !== 0) {
    exit = true
    obstacle = game.map[game.player.location.row].length
  }
  let path = ''
  // for each space between player and obstacle (not including obstacle) add to the set.
  for (let col = game.player.location.col; col < obstacle; col++) {
    const locationString = `${game.player.location.row},${col}`
    game.vistedLocations.add(locationString)
    path += locationString + ";"
  }
  game.player.location.col = obstacle - 1
  game.player.direction = 'down'
  return { exit, path }
}

const step = (game: Game): StepResult => {
  switch (game.player.direction) {
    case 'up':
      return up(game)
    case 'down':
      return down(game)
    case 'left':
      return left(game)
    case 'right': {
      return right(game)
    }
  }
}

const runGame = (game: Game): Game => {
  let exit = false
  while (!exit) {
    exit = step(game).exit
  }
  return game
}

const partOne = (input: string): number => {
  const game = parseInput(input)
  runGame(game)
  return game.vistedLocations.size
}

const copyMap = (map: Map<number, number[]>): Map<number, number[]> => {
  const newMap = new Map()
  Array.from(map).forEach(([key, value]) => {
    newMap.set(key, [...value])
  });
  return newMap;
}
const resetGame = (game: Game, objects: OriginalObjects, player: Player): Game => {
  game.objectsByRow = copyMap(objects.objectsByRow)
  game.objectsByCol = copyMap(objects.objectsByCol)
  game.vistedLocations = new Set()
  game.paths = []
  game.player = {
    ...player,
    location: { ...player.location }
  }
  return game
}

const partTwo = (input: string): number => {
  const game = parseInput(input)
  const originalObjects = {
    objectsByRow: copyMap(game.objectsByRow),
    objectsByCol: copyMap(game.objectsByCol),
  }
  const originalPlayer: Player = {
    location: {
      row: game.player.location.row,
      col: game.player.location.col,
    },
    direction: 'up'
  }
  // do a run so that I have a list of visited locations
  // I don't need to check placing objects outside of the original path
  runGame(game)
  const locationsToCheck = Array.from(game.vistedLocations)

  let count = 0
  for (const location of locationsToCheck) {
    const positions = location.split(',')
    const row = Number(positions[0] || 0)
    const col = Number(positions[1] || 0)
    const cell = game.map[Number(row)][Number(col)]
    if (cell === '^') {
      // don't use the starting location
      continue
    }
    resetGame(game, originalObjects, originalPlayer)
    if (!game.objectsByCol.get(col)) {
      game.objectsByCol.set(col, [])
    }
    game.objectsByCol.get(col)!.push(row)
    game.objectsByCol.get(col)!.sort((a,b) => a - b)

    if (!game.objectsByRow.get(row)) {
      game.objectsByRow.set(row, [])
    }
    game.objectsByRow.get(row)!.push(col)
    game.objectsByRow.get(row)!.sort((a,b) => a - b)

    let exit = false
    while (!exit) {
      const result = step(game)
      exit = result.exit
      if (game.paths.includes(result.path)) {
        count++;
        exit = true
      } else {
        game.paths.push(result.path)
      }
    }
  }
  return count
}

// console.log(partOne(data))
console.log(partTwo(data))
