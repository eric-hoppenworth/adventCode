import data from './input.ts'
import testData from './test.ts'

type Blueprint = {
  index: number;
  robots: {
    [key in ResourceType]: RobotRecipe;
  };
  maxResources: {
    [key in ResourceType]: number;
  }
}
type RobotRecipe = {
  [key in ResourceType]: number;
}
type BuildCommand = {
  type: ResourceType;
  canBuild: boolean;
  turns: number;
}
type Backpack = {
  resources: { [key in ResourceType]: number };
  robots: { [key in ResourceType]: number };
  elapsedTime: number;
}
enum ResourceType {
  Ore = 'ore',
  Clay = 'clay',
  Obsidian = 'obsidian',
  Geode = 'geode',
}

const parseInput = (input: string): Blueprint[] => {
  return input.split('\n').map((line) => {
    const regex = /Blueprint ([\d]{1,2}):.{1,}( [\d]{1,2} ).{1,}( [\d]{1,2} ).{1,}( [\d]{1,2} ).{1,}( [\d]{1,2} ).{1,}( [\d]{1,2} ).{1,}( [\d]{1,2} )/
    const matches = (line.match(regex) || []).slice(1).map((x) => parseInt(x, 10))
    return {
      index: matches[0],
      robots: {
        [ResourceType.Ore]: {
          [ResourceType.Ore]: matches[1],
          [ResourceType.Clay]: 0,
          [ResourceType.Obsidian]: 0,
          [ResourceType.Geode]: 0,
        },
        [ResourceType.Clay]: {
          [ResourceType.Ore]: matches[2],
          [ResourceType.Clay]: 0,
          [ResourceType.Obsidian]: 0,
          [ResourceType.Geode]: 0,
        },
        [ResourceType.Obsidian]: {
          [ResourceType.Ore]: matches[3],
          [ResourceType.Clay]: matches[4],
          [ResourceType.Obsidian]: 0,
          [ResourceType.Geode]: 0,
        },
        [ResourceType.Geode]: {
          [ResourceType.Ore]: matches[5],
          [ResourceType.Clay]: 0,
          [ResourceType.Obsidian]: matches[6],
          [ResourceType.Geode]: 0,
        }
      },
      maxResources: {
        [ResourceType.Ore]: Math.max(matches[1], matches[2], matches[3], matches[5]),
        [ResourceType.Clay]: matches[4],
        [ResourceType.Obsidian]: matches[6],
        [ResourceType.Geode]: Infinity,
      },
    }
  })
}

const collectResources = (backpack: Backpack) => {
  for (const type of Object.keys(backpack.robots) as ResourceType[]) {
    backpack.resources[type] += backpack.robots[type]
  }
}
const checkForResources = (backpack: Backpack, recipe: RobotRecipe): Boolean => {
  return Object.entries(recipe).every(([costType, cost]) => backpack.resources[costType as ResourceType] >= cost)
}
const getPossibleCrafts = (backpack: Backpack, blueprint: Blueprint): ResourceType[] => {
  let craftables: ResourceType[] = Object
    .entries(blueprint.robots)
    .map(([key, robot]) => checkForResources(backpack, robot) ? key as ResourceType : null)
    .filter(Boolean) as ResourceType[]

  // TODO: do not craft a robot if I already have enough of that type
  const removeTypes: ResourceType[] = []
  for (const type of [ResourceType.Ore, ResourceType.Clay, ResourceType.Obsidian]) {
    if (backpack.robots[type] >= blueprint.maxResources[type]) {
      removeTypes.push(type)
    }
  }
  return craftables.filter((type) => !removeTypes.includes(type))
}
const reduceResources = (backpack: Backpack, recipe: RobotRecipe) => {
  for (const [costType, cost] of Object.entries(recipe)) {
    backpack.resources[costType as ResourceType] -= cost
  }
}
const getPossibleGeodeCount = (backpack: Backpack, maxTime: number): number => {
  // TODO this stupidly assumes that the current backpack has NO geodes :face-palm:
  // return Infinity
  const m = maxTime - backpack.elapsedTime
  const k = backpack.resources[ResourceType.Geode]
  const n = backpack.robots[ResourceType.Geode]
  return k + ((n + m - 1) * (n + m) - (n - 1) * (n)) / 2
}

// supopse I have 3 robots and 5 geodes already
// I have idk, 5 minutes remaining. (and can build a geode robot every turn)
// I can have a max of (5) + 3(because I produce before I create) + 4 + 5 + 6 + 7

const getNextRobots = (backpack: Backpack, blueprint: Blueprint): BuildCommand[] => {
  // for each of the robot types in the blueprint, figure out how many turns I would need to wait to create it.
  // if I have zero [type] robots, don't consider [robots that need type] robots.
  return Object.entries(blueprint.robots).map(([key, recipe]) => {
    // I don't need any more robots of this type
    if (backpack.robots[key as ResourceType] >= blueprint.maxResources[key as ResourceType]) {
      return {
        type: key as ResourceType,
        canBuild: false,
        turns: 1,
      }
    }
    // check how many turns it will take to build the robot
    const turnCounts: number[] = [0]
    for (const resource of Object.keys(recipe) as ResourceType[]) {
      if (recipe[resource] === 0) {
        continue
      }
      if (backpack.robots[resource] === 0) {
        return {
          type: key as ResourceType,
          canBuild: false,
          turns: 1,
        }
      }

      turnCounts.push(Math.ceil((recipe[resource] - backpack.resources[resource]) / backpack.robots[resource]))
    }
    return {
      type: key as ResourceType,
      canBuild: true,
      turns: Math.max(...turnCounts),
    }
  })
}

const getBlueprintScore = (blueprint: Blueprint, maxTime: number) => {
  console.log(`starting ${blueprint.index}`)
  let backpacks: Backpack[] = [{
    resources: {
      [ResourceType.Ore]: 0,
      [ResourceType.Clay]: 0,
      [ResourceType.Obsidian]: 0,
      [ResourceType.Geode]: 0,
    },
    robots: {
      [ResourceType.Ore]: 1,
      [ResourceType.Clay]: 0,
      [ResourceType.Obsidian]: 0,
      [ResourceType.Geode]: 0,
    },
    elapsedTime: 0,
  }]
  let maxFinalGeodes = 0
  while (backpacks.length) {
    const backpack = backpacks.pop()
    if (!backpack) {
      continue
    }
    if (backpack.elapsedTime >= maxTime) {
      if (backpack.resources[ResourceType.Geode] > maxFinalGeodes) {
        maxFinalGeodes = backpack.resources[ResourceType.Geode]
      }
      continue
    }
    const maxPossibleGeodes = getPossibleGeodeCount(backpack, maxTime)
    if (maxPossibleGeodes < maxFinalGeodes) {
      continue
    }

    const buildCommands: BuildCommand[] = getNextRobots(backpack, blueprint)
    buildCommands.forEach((command) => {
      if (!command.canBuild) {
        return
      }
      const copyBackpack = JSON.parse(JSON.stringify(backpack)) as Backpack
      // wait for the specific number of turns
      let count = 0
      for (let i = 1; i <= command.turns && copyBackpack.elapsedTime <= maxTime - 1; i++) {
        copyBackpack.elapsedTime += 1
        count++
        collectResources(copyBackpack)
      }
      if (copyBackpack.elapsedTime === maxTime) {
        backpacks.push(copyBackpack)
        return
      }
      // build my robot
      reduceResources(copyBackpack, blueprint.robots[command.type])
      copyBackpack.elapsedTime += 1
      collectResources(copyBackpack)
      copyBackpack.robots[command.type] += 1
      backpacks.push(copyBackpack)
    })
  }
  return maxFinalGeodes
}

const partOne = (input: string): number => {
  const blueprints = parseInput(input)
  return blueprints.reduce((carry, blueprint) => carry + getBlueprintScore(blueprint, 24) * blueprint.index, 0)
}

const partTwo = (input: string): number => {
  const blueprints = parseInput(input).slice(0, 3)
  return blueprints.reduce((carry, blueprint) => carry * getBlueprintScore(blueprint, 32), 1)
}

// console.log(partOne(data))
console.log(partTwo(data))
