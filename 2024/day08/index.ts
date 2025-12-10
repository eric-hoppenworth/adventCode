import data from './input.ts'
import testData from './test.ts'

// location and frequency of each node. can group nodes of the same frequency together
// know the bounds of the map
// use a Set to track all anti-node locations
type Vector = {
  row: number;
  col: number;
}

type Antenna = {
  location: Vector;
  frequency: string;
}

type AntennaMap = {
  antennas: {
    [x: string]: Antenna[]
  };
  bound: Vector;
}

const addVectors = (a: Vector, b: Vector) => ({ row: a.row + b.row, col: a.col + b.col })
const scaleVector = (scale: number, a: Vector) => ({ row: scale * a.row, col: scale * a.col })

const parseInput = (input: string): AntennaMap => {
  let xBound = 0;
  let yBound = 0;
  const antennas: { [x: string]: Antenna[] } = {};
  input.split('\n').forEach((line, row) => {
    if (row > yBound) {
      yBound = row
    }
    line.split('').forEach((char: string, col) => {
      if (col > xBound) {
        xBound = col
      }
      if (char !== '.') {
        if (!antennas[char]) {
          antennas[char] = []
        }
        antennas[char].push({
          frequency: char,
          location: { row, col }
        })
      }
    })
  })
  return { antennas, bound: { row: yBound, col: xBound } }
}

const getNodesForFrequency = (antennas: Antenna[], bound: Vector): Set<string> => {
  const locationSet = new Set()
  for (let i = 0; i < antennas.length - 1; i++) {
    for (let j = i + 1; j < antennas.length; j++) {
      [{
        row: 2 * antennas[i].location.row - antennas[j].location.row,
        col: 2 * antennas[i].location.col - antennas[j].location.col,
      }, {
        row: 2 * antennas[j].location.row - antennas[i].location.row,
        col: 2 * antennas[j].location.col - antennas[i].location.col,
      }].forEach((location) => {
        if (
          location.row >= 0 && location.row <= bound.row
          && location.col >= 0 && location.col <= bound.col
        ) {
          locationSet.add(`${location.row},${location.col}`)
        }
      })
    }
  }
  return locationSet
}

const getExtendedNodesForFrequency = (antennas: Antenna[], bound: Vector): Set<string> => {
  const locationSet = new Set()
  for (let i = 0; i < antennas.length - 1; i++) {
    for (let j = i + 1; j < antennas.length; j++) {
      const changeVector = {
        row: antennas[i].location.row - antennas[j].location.row,
        col: antennas[i].location.col - antennas[j].location.col,
      }
      let k = 0
      while (true) {
        const diff = scaleVector(k, changeVector)
        const newLocation = addVectors(antennas[i].location, diff)
        if (
          newLocation.row >= 0 && newLocation.row <= bound.row
          && newLocation.col >= 0 && newLocation.col <= bound.col
        ) {
          locationSet.add(`${newLocation.row},${newLocation.col}`)
        } else {
          break
        }
        k++
      }
      k = -1
      while (true) {
        const diff = scaleVector(k, changeVector)
        const newLocation = addVectors(antennas[i].location, diff)
        if (
          newLocation.row >= 0 && newLocation.row <= bound.row
          && newLocation.col >= 0 && newLocation.col <= bound.col
        ) {
          locationSet.add(`${newLocation.row},${newLocation.col}`)
        } else {
          break
        }
        k--
      }
      // add this change vector until at least one bound is escaped
    }
  }
  return locationSet
}

const partOne = (input: string): number => {
  const antennaMap = parseInput(input)
  let antinodes: Set<string> = new Set()
  for (const antennas of Object.values(antennaMap.antennas)) {
    const newLocations = getNodesForFrequency(antennas, antennaMap.bound);
    antinodes = antinodes.union(newLocations)
  }
  return antinodes.size
}
const partTwo = (input: string): number => {
  const antennaMap = parseInput(input)
  let antinodes: Set<string> = new Set()
  for (const antennas of Object.values(antennaMap.antennas)) {
    const newLocations = getExtendedNodesForFrequency(antennas, antennaMap.bound);
    antinodes = antinodes.union(newLocations)
  }
  return antinodes.size
}

// console.log(partOne(data))
console.log(partTwo(data))
