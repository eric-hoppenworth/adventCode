import data from './input.ts'
import testData from './test.ts'

type Vector = {
  x: number;
  y: number;
  z: number;
}
type Axis = keyof Vector
type Range = {
  min: Vector;
  max: Vector;
}

type Graph3 = Record<number, Record<number, Record<number, boolean>>>

const addVectors = (a: Vector, b: Vector): Vector => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z })

const directions: Vector[] = [
  { x: 1, y: 0, z: 0 },
  { x: -1, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: 0, y: -1, z: 0 },
  { x: 0, y: 0, z: 1 },
  { x: 0, y: 0, z: -1 },
]

const parseInput = (input: string): Vector[] => {
  return input.split('\n').map((line) => {
    const [x, y, z] = line.split(',').map(a => parseInt(a, 10))
    return { x, y, z }
  })
}

const getGraphValue = (graph: Graph3, vector: Vector): boolean => graph[vector.z] && graph[vector.z][vector.y] && graph[vector.z][vector.y][vector.x]

const getGraph = (vectors: Vector[]): Graph3 => {
  const graph: Graph3 = {}
  for (const vector of vectors) {
    if (!graph[vector.z]) {
      graph[vector.z] = {}
    }
    if (!graph[vector.z][vector.y]) {
      graph[vector.z][vector.y] = {}
    }
    graph[vector.z][vector.y][vector.x] = true
  }
  return graph
}
const getVectors = (graph: Graph3): Vector[] => {
  const vectors = []
  for (const z of Object.keys(graph).map((k) => parseInt(k, 10))) {
    for (const y of Object.keys(graph[z]).map((k) => parseInt(k, 10))) {
      for (const x of Object.keys(graph[z][y]).map((k) => parseInt(k, 10))) {
        vectors.push({ z, y, x })
      }
    }
  }
  return vectors
}

const getSurfaceArea = (graph: Graph3, vectors: Vector[]): number => {
  let count = 0
  for (const vector of vectors) {
    for (const direction of directions) {
      const myVector = addVectors(vector, direction)
      if (!getGraphValue(graph, myVector)) {
        count++
      }
    }
  }
  return count
}

const getInvertedGraph = (graph: Graph3, vector: Vector, range: Range): Graph3 | null => {
  const queue: Vector[] = [vector]
  const invertedGraph: Graph3 = {
    [vector.z] : {
      [vector.y] : {
        [vector.x] : true
      }
    }
  }
  while (queue.length) {
    const vector = queue.pop() as Vector
    for (const direction of directions) {
      const myVector = addVectors(vector, direction)
      for (const axis of Object.keys(vector) as Axis[]) {
        if (myVector[axis] < range.min[axis] || myVector[axis] > range.max[axis]) {
          return null
        }
      }
      if (!getGraphValue(graph, myVector) && !getGraphValue(invertedGraph, myVector)) {
        queue.push(myVector)
        if (!invertedGraph[myVector.z]) {
          invertedGraph[myVector.z] = {}
        }
        if (!invertedGraph[myVector.z][myVector.y]) {
          invertedGraph[myVector.z][myVector.y] = {}
        }
        invertedGraph[myVector.z][myVector.y][myVector.x] = true
      }
    }
  }
  return invertedGraph
}

const partOne = (input: string): number => {
  const vectors = parseInput(input)
  const graph = getGraph(vectors)
  return getSurfaceArea(graph, vectors)
}

const getMaxRange = (vectors: Vector[]): Range => {
  const min = {
    x: Infinity,
    y: Infinity,
    z: Infinity,
  }
  const max = {
    x: -Infinity,
    y: -Infinity,
    z: -Infinity,
  }
  for (const vector of vectors) {
    for (const axis of Object.keys(vector) as Axis[]) {
      if (vector[axis] < min[axis]) {
        min[axis] = vector[axis]
      }
      if (vector[axis] > max[axis]) {
        max[axis] = vector[axis]
      }
    }
  }
  return { min, max }
}
const mergeGraph = (a: Graph3, b: Graph3): Graph3 => {
  const c = JSON.parse(JSON.stringify(a))
  for (const z of Object.keys(b).map((k) => parseInt(k, 10))) {
    for (const y of Object.keys(b[z]).map((k) => parseInt(k, 10))) {
      for (const x of Object.keys(b[z][y]).map((k) => parseInt(k, 10))) {
        if (!c[z]) {
          c[z] = {}
        }
        if (!c[z][y]) {
          c[z][y] = {}
        }
        c[z][y][x] = true
      }
    }
  }
  return c
}

const partTwo = (input: string): number => {
  const vectors = parseInput(input)
  const graph = getGraph(vectors)
  const range = getMaxRange(vectors)
  const queue: Vector[] = []
  for (let z = range.min.z; z <= range.max.z; z++) {
    for (let y = range.min.y; y <= range.max.y; y++) {
      for (let x = range.min.x; x <= range.max.x; x++) {
        if (!getGraphValue(graph, { z, y, x })) {
          queue.push({ z, y, x })
        }
      }
    }
  }

  let invertedGraph: Graph3 = {}
  for (const vector of queue) {
    const otherGraph = getInvertedGraph(graph, vector, range)
    if (otherGraph) {
      invertedGraph = mergeGraph(invertedGraph, otherGraph)
    }
  }
  // what is the solution here?
  // I think I could path from the outside (-1,-1,-1) to (max, max, max) and see how many space I can't reach?
  // I would still have to do some math after that to see what the outer surface area is
  // alternatively, for any air pocket I could try to path OUTWARDS. If I have a finite space, then it is an air pocket
  // I can find a "finite space" if the direction checked ever has a x, y, or z out side of min/max
  //
  // interstingly, an airpocket of 1 cube removes 6 from the original surface area.
  // an airpocket of two touching cubes removes 10 (it's own surface area)
  // so if I could find groups that are airpockets, I can calculate their SA and subtract it from the first answer

  return getSurfaceArea(graph, vectors) - getSurfaceArea(invertedGraph, getVectors(invertedGraph))
}

console.log(partTwo(data))
