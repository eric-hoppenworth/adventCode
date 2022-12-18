import data from './input.ts'
import testData from './test.ts'

type Cavern = {
  rate: number;
  name: string;
  leadsTo: string[];
  valveOpen: boolean;
  distances: Record<string, number>;
}

type Step = {
  name: string;
  action: string; // MOVE or OPEN
}

type Cave = Record<string, Cavern>

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
      valveOpen: false,
      distances: {},
    }
  })
  return cave
}

const getAllPaths = (cave: Cave, path: Step[]): Step[][] | false => {
  if (path.length >= 31) {
    return false
  }
  if (path.length >= 5 && !path.find((step: Step) => step.action === 'OPEN')) {
    return false
  }
  const paths: Step[][] = []
  const myCavern = cave[path[path.length - 1].name]
  if (!path.find((step: Step) => step.action === 'OPEN' && step.name === myCavern.name) && myCavern.rate) {
    paths.push(path.concat({ name: myCavern.name, action: 'OPEN' }))
  }
  const previousStep = path[path.length - 2]
  return paths.concat(
    myCavern.leadsTo
      .filter((name: string) => previousStep ? previousStep.name !== name : true)
      .map((name: string) => path.concat({ name, action: 'MOVE' }))
  )
}
const getScore = (cave: Cave, path: Step[]): number => {
  let score = 0
  for (const index in path) {
    const step = path[index]
    if (step.action === "OPEN") {
      score += cave[step.name].rate * (30 - parseInt(index, 10))
    }
  }
  return score
}

const partOneBrute = (input: string): number => {
  const cave = parseInput(input)
  let paths: Step[][] = [[{ name: 'AA', action: 'MOVE' }]]
  let count = 0
  const finishedPaths: Step[][] = []
  while(paths.length) {
    const path = paths.pop()
    if (!path) {
      break
    }
    if (path.length >= 31) {
      finishedPaths.push(path)
    }
    const newPaths = getAllPaths(cave, path)

    if (newPaths) {
      paths = paths.concat(newPaths)
    }
    count++
  }
  console.log(finishedPaths.length)
  let max = 0
  for (const path of finishedPaths) {
    const score = getScore(cave, path)
    if (score > max) {
      max = score
    }
  }
  return max
}

const getDistances = (cave: Cave, start: string) => {
  // pathing algorithm
  // all caverns should start with a zero cost
  const moveBoard: Record<string, number> = {}
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

const partOne = (input: string): number => {
  const cave = parseInput(input)
  const nodes: Cavern[] = Object.values(cave).filter((cavern) => cavern.rate)
  cave['AA'].distances = getDistances(cave, 'AA')
  nodes.forEach(cavern => {
    cavern.distances = getDistances(cave, cavern.name)
  })
  console.log(cave)
  return 1
}


console.log(partOne(testData))
