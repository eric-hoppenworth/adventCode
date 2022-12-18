import data from './input.ts'
import testData from './test.ts'

type Cavern = {
  rate: number;
  name: string;
  leadsTo: string[];
  distances: DistanceRecord;
}
type DistanceRecord = Record<string, number>;
type Cave = Record<string, Cavern>
type Unit = {
  name: string;
  location: Cavern;
  remainingSteps: number;
}
type Path = {
  units: Unit[];
  remainingNodes: Cavern[];
  score: number;
}

const parseInput = (input: string): Cave => {
  const cave: Cave = {}
  input.split('\n').forEach((line) => {
    const regex = /Valve ([A-Z]{2}) has flow rate=([\d]{1,2}); tunnels? leads? to valves? (.*)$/
    const match = line.match(regex)
    if (!match) {
      throw new Error()
    }
    const name = match[1]
    cave[name] = {
      rate: parseInt(match[2], 10),
      name,
      leadsTo: match[3].split(', '),
      distances: {},
    }
  })
  return cave
}

const getDistances = (cave: Cave, start: string) => {
  const moveBoard: DistanceRecord = {}
  Object.values(cave).forEach((cavern) => moveBoard[cavern.name] = 0)
  const queue = [start]
  while (queue.length) {
    const location = queue.pop() as string
    const cavern = cave[location]
    const currentStep = moveBoard[location]
    cavern.leadsTo.forEach((cavernName: string) => {
      const existingStep = moveBoard[cavernName]
      if (currentStep + 1 < existingStep || existingStep === 0) {
        moveBoard[cavernName] = currentStep + 1
        queue.push(cavernName)
      }
    })
  }
  moveBoard[start] = 0
  return moveBoard
}

const getPaths = (path: Path): Path[] => {
  return path.remainingNodes.map((cavern): false | Path => {
    // I should move the unit with the large number of steps remaining
    let unitToMove: Unit = { ...path.units[0] }
    let maxRemaining = -Infinity
    path.units.forEach((unit) => {
      if (unit.remainingSteps > maxRemaining) {
        maxRemaining = unit.remainingSteps
        unitToMove = { ...unit }
      }
    })
    if (!unitToMove) {
      return false
    }
    const stepsToOpen = unitToMove.location.distances[cavern.name] + 1
    const remainingSteps = unitToMove.remainingSteps - stepsToOpen
    if (remainingSteps < 0) {
      return false
    }
    unitToMove.remainingSteps = remainingSteps
    unitToMove.location = cavern
    return {
      units: path.units.map((unit) => unit.name === unitToMove.name ? unitToMove : unit),
      remainingNodes: path.remainingNodes.filter(a => a !== cavern),
      score: path.score + (cavern.rate * remainingSteps),
    }
  }).filter(Boolean) as Path[]
}

const partOne = (input: string): number => {
  const cave = parseInput(input)
  const nodes: Cavern[] = Object.values(cave).filter((cavern) => cavern.rate)
  cave['AA'].distances = getDistances(cave, 'AA')
  nodes.forEach(cavern => {
    cavern.distances = getDistances(cave, cavern.name)
  })
  // now, starting from AA, I want to move to each node independantly
  const startPath = {
    units: [{ name: 'ME', location: cave['AA'], remainingSteps: 30 }],
    remainingNodes: nodes,
    score: 0,
  }
  let queue: Path[] = [startPath]
  const finalPaths: Path[] = []
  while(queue.length) {
    const path = queue.pop() as Path
    const newPaths = getPaths(path)
    if (!newPaths.length) {
      finalPaths.push(path)
    } else {
      queue = queue.concat(newPaths)
    }
  }
  return Math.max(...finalPaths.map(a => a.score))
}

const partTwo = async (input: string) => {
  const cave = parseInput(input)
  const nodes: Cavern[] = Object.values(cave).filter((cavern) => cavern.rate)
  cave['AA'].distances = getDistances(cave, 'AA')
  nodes.forEach(cavern => {
    cavern.distances = getDistances(cave, cavern.name)
  })
  // now, starting from AA, I want to move to each node independantly
  const startPath = {
    units: [{ name: 'ME', location: cave['AA'], remainingSteps: 26 }, { name: 'ELEPHANT', location: cave['AA'], remainingSteps: 26 }],
    remainingNodes: nodes,
    score: 0,
  }
  let queue: Path[] = [startPath]
  const finalPaths: Path[] = []
  // let paths = getPaths(startPath)
  // for (let i = 0; i < nodes.length; i++) {
  //   console.log(paths)
  //   paths = getPaths(paths[paths.length - 1])
  // }
  // console.log(paths)
  let count = 0
  while(queue.length && count < 10000) {
    const path = queue.pop() as Path
    const newPaths = getPaths(path)
    if (!newPaths.length) {
      finalPaths.push(path)
    } else {
      // check each new path to see if it needs to be added to the queue
      // for (const newPath of newPaths) {
      //   for (const queuedPath of queue) {
      //     console.log('checking...')
      //     const newRemaining = newPath.remainingNodes.map(a => a.name).sort().join()
      //     const queuedRemaining = queuedPath.remainingNodes.map(a => a.name).sort().join()
      //     console.log(newRemaining)
      //     console.log(queuedRemaining)
      //     if (newRemaining === queuedRemaining) {
      //       console.log('matched!')
      //     }
      //     // paths are the same if
      //       // remainingNodes is equal
      //       // score is equal (?)
      //
      //   }
      // }
      queue = queue.concat(newPaths)
    }
    count++
    if (count % 500000 === 0) {
      console.log(queue.length)
      console.log(finalPaths.length)
    }
  }
  await Deno.writeTextFile("./real-queue.txt", JSON.stringify(queue, null, 2));
  return Math.max(...finalPaths.map(a => a.score))
}


console.log(partOne(data))
// console.log(partTwo(data))
