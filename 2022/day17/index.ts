import data from './input.ts'
import testData from './test.ts'
type Position = {
  row: number;
  col: number;
}

type CaveSection = string[][]
enum Direction {
  Down = 'D',
  Right = '>',
  Left = '<',
}
const ROCK = '#'
const NILL = '.'

const directionMap: { [key in Direction]: Position } = {
  [Direction.Down]: { row: 1, col: 0 },
  [Direction.Right]: { row: 0, col: 1 },
  [Direction.Left]: { row: 0, col: -1 },
}
const EMPTY_ROW: string[] = [NILL,NILL,NILL,NILL,NILL,NILL,NILL]
const getEmptyRows = (count: number): CaveSection => {
  const row: string[][] = []
  for (let i = 0; i < count; i++) {
    row.push([...EMPTY_ROW])
  }
  return row
}
const rocks: CaveSection[] = [
  [
    [NILL,NILL,NILL,NILL],
    [NILL,NILL,NILL,NILL],
    [NILL,NILL,NILL,NILL],
    [ROCK,ROCK,ROCK,ROCK]
  ],
  [
    [NILL,ROCK,NILL],
    [ROCK,ROCK,ROCK],
    [NILL,ROCK,NILL]
  ],
  [
    [NILL,NILL,ROCK],
    [NILL,NILL,ROCK],
    [ROCK,ROCK,ROCK]
  ],
  [
    [ROCK,NILL,NILL,NILL],
    [ROCK,NILL,NILL,NILL],
    [ROCK,NILL,NILL,NILL],
    [ROCK,NILL,NILL,NILL]
  ],
  [
    [ROCK,ROCK],
    [ROCK,ROCK]
  ]
]

class Queue<T> {
  private list: T[]
  private index: number
  constructor(list: T[]) {
    this.list = list
    this.index = -1
  }
  public getNext() {
    this.index = this.index + 1
    if (this.index === this.list.length) {
      this.index = 0
    }
    return this.list[this.index]
  }
}

const parseInput = (input: string): Direction[] => {
  return input.split('') as Direction[]
}

const partOne = (input: string): number => {
  const jets = new Queue(parseInput(input))
  const rockQueue = new Queue(rocks)
  const room: CaveSection = [[ROCK,ROCK,ROCK,ROCK,ROCK,ROCK,ROCK]]

  // add three empty rows...
  const newRoom = getEmptyRows(3).concat(room)
  const rockStart = { row: 0, col: 1 }
  // get a rock
  const rock = rockQueue.getNext()
  // add the rock to the top of the room...
  const rockRows: CaveSection = []
  for (let row = 0; row < rock.length; row++) {
    const checkRow = row < rock.length ? row : row - rock.length
    for (let col = 0; col < 7; col++) {

    }
  }
  console.log(newRoom)
  return 1
}

console.log(partOne(testData))
