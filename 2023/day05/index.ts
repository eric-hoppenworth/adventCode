import data from './input.ts'
import testData from './test.ts'

type SeedMapLine = {
  destinationStart: number;
  sourceStart: number;
  range: number;
}
type SeedMap = {
  name: string;
  lines: SeedMapLine[];
}
type Almanac = {
  seeds: number[];
  maps: SeedMap[];
}

const parseInput = (input: string): Almanac => {
  const groups = input.split('\n\n')
  return {
    seeds: groups[0].split(': ')[1].split(' ').map(a => parseInt(a)),
    maps: groups.splice(1).map(line => {
      const lines = line.split('\n')
      return {
        name: lines[0],
        lines: lines.splice(1).map((a) => {
          const [destinationStart, sourceStart, range] = a.split(' ').map(b => parseInt(b))
          return { destinationStart, sourceStart, range }
        })
      }
    })
  }
}

const transformSeed = (seed: number, map: SeedMap): number => {
  for (const line of map.lines) {
    if (line.sourceStart <= seed && seed < (line.sourceStart + line.range)) {
      return seed - line.sourceStart + line.destinationStart
    }
  }
  return seed
}

const partOne = (input: string): number => {
  const almanac = parseInput(input)
  const locations = almanac.seeds.map((seed) => {
    let value = seed
    for (const map of almanac.maps) {
      value = transformSeed(value, map)
    }
    return value
  })
  console.log(locations)
  return Math.min(...locations)
}

console.log(partOne(data))
