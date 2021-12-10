import data from './input.ts'
import testData from './test.ts'

type HeightMap = number[][]
type VectorQueue = Map<string, number>
type Vector = {
  row: number;
  col: number;
}
type Basin = Vector[]

const parseInput = (input: string): HeightMap => {
  return input.split('\n').map((row: string) => row.split('').map((cell: string): number => parseInt(cell, 10)))
}

const getMapValue = (map: HeightMap, position: Vector): number => {
  return (!map[position.row] || map[position.row][position.col] === undefined) ? Infinity : map[position.row][position.col]
}

const checkAdjacent = (map: HeightMap, position: Vector): boolean => {
  const myValue = getMapValue(map, position)
  const checkVectors: Vector[] = [
    { col: position.col, row: position.row - 1 },
    { col: position.col, row: position.row + 1 },
    { col: position.col - 1, row: position.row },
    { col: position.col + 1, row: position.row },
  ]
  return checkVectors.every((vector: Vector) => getMapValue(map, vector) > myValue)
}

const partOne = (map: HeightMap): number => {
  console.log(data)
  return map.reduce((carry: number, row: number[], rowIndex: number): number => {
    return carry + row.reduce((rowTotal: number, cell: number, columnIndex: number) => {
      const position: Vector = { row: rowIndex, col: columnIndex }
      if (checkAdjacent(map, position)) {
        console.log(position)
      }
      return rowTotal + (checkAdjacent(map, position) ? (1 + getMapValue(map, position)) : 0)
    }, 0)
  }, 0)
}

const partTwo = (heightMap: HeightMap): number => {
  const queue: VectorQueue = new Map();
  const basins: Basin[] = []
  for (const rowIndex in heightMap) {
    for (const colIndex in heightMap[rowIndex]) {
      const myVector: Vector = {
        col: parseInt(colIndex, 10),
        row: parseInt(rowIndex, 10),
      }
      queue.set(JSON.stringify(myVector), heightMap[rowIndex][colIndex])
    }
  }
  let count = 0
  for (const [key, value] of queue) {
    count++
    if (value >= 9) {
      continue
    }
    const position: Vector = JSON.parse(key)
    const basin: Basin = crawlMap(heightMap, position)
    for (const location of basin) {
      const deleted = queue.delete(JSON.stringify(location))
    }
    basins.push(basin)
  }
  const sizes: number[] = basins.map((basin: Basin): number => basin.length).sort((a,b) => a - b).slice(-3)
  return sizes.reduce((carry: number, size: number): number => carry * size, 1)
}

const crawlMap = (map: HeightMap, startingPosition: Vector): Basin => {
  const queue: Vector[] = [startingPosition]
  const visited: Basin = [startingPosition]
  while (queue.length) {
    const position = queue.pop()
    if (!position) {
      continue
    }

    const checkVectors: Vector[] = [
      { col: position.col, row: position.row - 1 },
      { col: position.col, row: position.row + 1 },
      { col: position.col - 1, row: position.row },
      { col: position.col + 1, row: position.row },
    ]
    for (const vector of checkVectors) {
      const alreadyVisted = visited.find((v) => {
        return v.row === vector.row && v.col === vector.col
      })
      if (alreadyVisted) {
        continue
      }
      if (getMapValue(map, vector) < 9) {
        queue.push(vector)
        visited.push(vector)
      }
    }
  }
  return visited
}

// console.log(partOne(parseInput(data)))
console.log(partTwo(parseInput(data)))
