import data from './input.ts'
import testData from './test.ts'

type Vector = {
  row: number // y
  col: number // x
}

type ParsedInput = {
  dotList: Vector[]
  foldList: Vector[]
}

const reflectVectorAcross = (vector: Vector, reflectionVector: Vector): Vector => {
  return {
    row: reflectionVector.row > 0 ? reflectionVector.row - Math.abs(reflectionVector.row - vector.row) : vector.row,
    col: reflectionVector.col > 0 ? reflectionVector.col - Math.abs(reflectionVector.col - vector.col) : vector.col,
  }
}

const removeDuplicateVectors = (list: Vector[]) => {
  const mySet: Set<string> = new Set()
  list.forEach((v: Vector) => {
    mySet.add(`${v.row}-${v.col}`)
  })

  const newList: Vector[] = []
  for (const coords of mySet) {
    const [row, col] = coords.split('-')
    newList.push({
      row: parseInt(row, 10),
      col: parseInt(col, 10),
    })
  }
  return newList
}

const parseInput = (input: string) => {
  const [dots, folds] = input.split('\n\n')
  return {
    dotList: dots.split('\n').map((coords: string): Vector => {
      const [col, row] = coords.split(',')
      return {
        row: parseInt(row, 10),
        col: parseInt(col, 10),
      }
    }),
    foldList: folds.split('\n').map((command: string): Vector => {
      const [,axis, coord] = command.match(/([xy])=(\d*)$/) || ['', 'x', '0']
      const name = {
        'x': 'col',
        'y': 'row'
      }[axis] || 'col'
      const value = parseInt(coord, 10)
      return {
        ...{ row: 0, col: 0 },
        [name]: value
      }
    })
  }
}

const foldPaper = (list: Vector[], reflectionVector: Vector): Vector[] => {
  return removeDuplicateVectors(list.map((dot: Vector): Vector => {
    return reflectVectorAcross(dot, reflectionVector)
  }))
}

const printCode = (list: Vector[], size: Vector): string => {
  const board: string[][] = []
  for (let y = 0; y < size.row; y++) {
    const row = []
    for (let x = 0; x < size.col; x++) {
      row.push(' ')
    }
    board.push(row)
  }
  for (const dot of list) {
    board[dot.row][dot.col] = '#'
  }
  return board.map((row) => row.join('')).join('\n')
}

const getSize = (foldList: Vector[]): Vector => {
  const minVector: Vector = {
    row: Infinity,
    col: Infinity,
  }
  foldList.forEach((reflection: Vector) => {
    const { row, col } = reflection
    if (row > 0 && row < minVector.row) {
      minVector.row = row
    }
    if (col > 0 && col < minVector.col) {
      minVector.col = col
    }
  })
  return minVector;
}

const partOne = (input: ParsedInput): number => {
  return foldPaper(input.dotList, input.foldList[0]).length
}

const partTwo = (input: ParsedInput): string => {
  let vectors = input.dotList
  for (const reflectionVector of input.foldList) {
    vectors = foldPaper(vectors, reflectionVector)
  }
  return printCode(vectors, getSize(input.foldList))
}

// console.log(partOne(parseInput(data)))
console.log(partTwo(parseInput(data)))
