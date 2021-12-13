import data from './input.ts'
import testData from './test.ts'

const START = 'start'
const END = 'end'

type Edge = [string, string]
type Node = {
  name: string
  largeCave: boolean
  connections: string[]
}
type Path = Node[]
type NodeMap = Map<string, Node>
type RevistChecker = (myPath:Path, node: Node) => boolean

const parseInput = (inputString: string): NodeMap => {
  return getGraphFromEdges(inputString.split('\n').map((line: string): Edge => {
    const [caveA, caveB] = line.split('-')
    return [caveA || '', caveB || '']
  }))
}
const getGraphFromEdges = (edges: Edge[]): NodeMap => {
  const map: NodeMap = new Map()
  edges.forEach(([caveA, caveB]: Edge) => {
    const existingNodeA = map.get(caveA)
    if (!existingNodeA) {
      map.set(caveA, getNewNode(caveA, caveB))
    } else {
      existingNodeA.connections.push(caveB)
    }

    const existingNodeB = map.get(caveB)
    if (!existingNodeB) {
      map.set(caveB, getNewNode(caveB, caveA))
    } else {
      existingNodeB.connections.push(caveA)
    }
  })

  return map
}
const getNewNode = (caveA: string, caveB: string): Node => {
  return {
    name: caveA,
    largeCave: caveA.toUpperCase() === caveA,
    connections: [caveB]
  }
}

const getNewPaths = (map: NodeMap, myPath: Path, checkNoRevist: RevistChecker): Path[] => {
  if (!myPath.length) {
    const myNode = map.get(START)
    if (!myNode) {
      return []
    }
    return [[myNode]]
  }
  const myNode = myPath[myPath.length - 1]
  // if my node is the end node, don't look for more connections
  if (myNode.name === END) {
    return [myPath]
  }
  return myNode.connections.map((name: string): Path | null => {
    const nextNode = map.get(name)
    if (!nextNode) {
      return null
    }
    // if the next node is not traversable, don't make a new path
    if (checkNoRevist(myPath, nextNode)) {
      return null
    }
    return myPath.concat(nextNode)
  }).filter(Boolean) as Path[]
}

const findPaths = (map: NodeMap, revistChecker: RevistChecker): Path[] => {
  let paths = getNewPaths(map, [], revistChecker)
  let previousLength = 0
  while (paths.length !== previousLength) {
    previousLength = paths.length
    paths = paths.map((myPath) => getNewPaths(map, myPath, revistChecker)).flat()
  }
  return paths
}

const partOne = (map: NodeMap): number => {
  const visitSmallCavesOnce: RevistChecker = (myPath: Path, node: Node): boolean => {
    return !node.largeCave && myPath.includes(node)
  }
  return findPaths(map, visitSmallCavesOnce).length
}

const partTwo = (map: NodeMap): number => {
  const visitOneSmallCaveTwice: RevistChecker = (myPath: Path, node: Node): boolean => {
    // if this is either start of end, do not revist
    if (node.largeCave) {
      return false
    }
    if (node.name === START || node.name === END) {
      return myPath.includes(node)
    }
    // else, this is a small cave
    // I can visit one small cave twice, so i need to check that the path does not already contain a revist
    // collapse the path into a counter
    const visitMap: Map<string, number> = new Map()
    let alreadyRevisited = false
    for (const pathNode of myPath) {
      if (pathNode.largeCave || pathNode.name === START || pathNode.name === END) {
        continue
      }
      const count = visitMap.get(pathNode.name)
      if (!count) {
        visitMap.set(pathNode.name, 1)
      } else {
        visitMap.set(pathNode.name, count + 1)
        alreadyRevisited = true
      }
    }
    const nodeVisitCount = (visitMap.get(node.name) || 0) + 1 // add one because I am about to visit it
    return nodeVisitCount >= 2 && alreadyRevisited ? true : false
  }
  return findPaths(map, visitOneSmallCaveTwice).length
}

// console.log(partOne(parseInput(data)))
console.log(partTwo(parseInput(data)))
