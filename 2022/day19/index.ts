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
type Backpack = {
  resources: { [key in ResourceType]: number };
  robots: { [key in ResourceType]: number };
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
        [ResourceType.Geode]: 0,
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

const getBlueprintScore = (blueprint: Blueprint) => {
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
  }]
  for (let minute = 1; minute <= 24; minute++) {
    // TODO: remove some branches by assuming we can build a geode robot
    let maxGeode = 0
    backpacks.forEach((backpack) => {
      if (backpack.resources[ResourceType.Geode] > maxGeode) {
        maxGeode = backpack.resources[ResourceType.Geode]
      }
    })
    console.log(`minute ${minute}`)
    console.log(backpacks.length)
    const remainingMinutes = 24 - minute
    const newPacks: Backpack[] = []
    backpacks.forEach((copyBackpack) => {
      if (copyBackpack.resources[ResourceType.Geode] + remainingMinutes < maxGeode) {
        // kill this branch
        console.log('branch killed')
        return;
      }
      let craftables: (ResourceType | undefined)[] = getPossibleCrafts(copyBackpack, blueprint)
      // console.log(craftables)
      // console.log(copyBackpack)
      // console.log(blueprint)
      craftables.push(undefined)
      if (craftables.includes(ResourceType.Geode)) {
        craftables = [ResourceType.Geode]
      }
      craftables.forEach((craftedRobot) => {
        const backpack = JSON.parse(JSON.stringify(copyBackpack)) as Backpack
        if (craftedRobot) {
          reduceResources(backpack, blueprint.robots[craftedRobot])
        }
        // console.log('collected')
        collectResources(backpack)
        if (craftedRobot) {
          backpack.robots[craftedRobot] += 1
        }
        newPacks.push(backpack)
      })
    })
    // backpacks = newPacks
    let maxGeode2 = 0
    backpacks.forEach((backpack) => {
      if (backpack.robots[ResourceType.Geode] > maxGeode2) {
        maxGeode2 = backpack.robots[ResourceType.Geode]
      }
    })
    backpacks = newPacks.filter((backpack) => backpack.robots[ResourceType.Geode] >= maxGeode2 - 1)
    if (maxGeode2 === 0) {
      let maxObsidian = 0
      backpacks.forEach((backpack) => {
        if (backpack.robots[ResourceType.Obsidian] > maxObsidian) {
          maxObsidian = backpack.robots[ResourceType.Obsidian]
        }
      })
      backpacks = backpacks.filter((backpack) => backpack.robots[ResourceType.Obsidian] >= maxObsidian - 2)
    }
    // TODO: I can further prune the backpacks by keeping only packs with the MOST resources, when bot counts are otherwise equal
    // this actually seems harder to calculate than I think it is
  }
  let max = 0
  backpacks.forEach((backpack) => {
    if (backpack.resources[ResourceType.Geode] > max) {
      max = backpack.resources[ResourceType.Geode]
    }
  })
  console.log(`value = ${max * blueprint.index} index = ${blueprint.index}`)
  return max * blueprint.index
}

const partOne = (input: string): number => {
  const blueprints = parseInput(input)
  return blueprints.reduce((carry, blueprint) => carry + getBlueprintScore(blueprint), 0)
}

console.log(partOne(testData))
