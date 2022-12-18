import data from './input.ts'
import testData from './test.ts'

type Position = {
  row: number;
  col: number;
}

type ObjectPair = {
  sensor: Position;
  beacon: Position;
  distance: number;
}
const distanceBetween = (a: Position, b: Position): number => Math.abs(a.row - b.row) + Math.abs(a.col - b.col)
const parseInput = (input: string): ObjectPair[] => {
  return input.split('\n').map((line: string) => {
    let sensor = { row: 0, col: 0 }
    let beacon = { row: 0, col: 0 }
    let m
    const regex = /x=([-\d]*), y=([-\d]*)/g
    while ((m = regex.exec(line)) !== null) {
      const position = { row: parseInt(m[2], 10), col: parseInt(m[1], 10) }
      if (m.index === 10) {
        sensor = position
      } else {
        beacon = position
      }
    }
    return {
      beacon,
      sensor,
      distance: distanceBetween(beacon, sensor)
    }
  })
}

const getBounds = (values: number[]): { min: number, max: number } => {
  let min = Infinity
  let max = -Infinity
  values.forEach((value: number) => {
    if (value < min) {
      min = value
    }
    if (value > max) {
      max = value
    }
  })
  return {
    min,
    max,
  }
}

const checkSensors = (checkPosition: Position, objects: ObjectPair[]): boolean => {
  return objects.some((obj: ObjectPair) => {
    const distanceToSensor = distanceBetween(checkPosition, obj.sensor)
    return distanceToSensor <= obj.distance
  })
}

const partOne = (input: string, checkRow: number = 10): number => {
  const objects = parseInput(input)
  const bounds = getBounds(objects.map((obj) => [obj.beacon.col, obj.sensor.col]).flat())
  const maxDistance = Math.max(...objects.map(a => a.distance))
  let count = 0
  for (let col = bounds.min - maxDistance; col <= bounds.max + maxDistance; col++) {
    const checkPosition = { row: checkRow, col }
    const isBeaconPostion = objects.some((obj) => distanceBetween(checkPosition, obj.beacon) === 0)
    if (isBeaconPostion) {
      continue
    }
    count = count + (checkSensors(checkPosition, objects) ? 1 : 0)
  }
  return count
}

const partTwo = (input: string, checkSize: number = 20): number => {
  const objects = parseInput(input)
  for (let row = 0; row <= checkSize; row++) {
    for (let col = 0; col <= checkSize; col++) {
      const checkPosition = { row, col }
      for (const index in objects) {
        const object = objects[index]
        const isInZone = distanceBetween(checkPosition, object.sensor) <= object.distance
        if (isInZone) {
          const rowDistance = Math.abs(row - object.sensor.row)
          col = object.sensor.col + object.distance - rowDistance
          break
        }
        if (parseInt(index, 10) === (objects.length - 1)) {
          return (checkPosition.col * 4000000) + checkPosition.row
        }
      }

    }
  }
  return 1
}
// console.log(partOne(testData, 10))
// console.log(partOne(data, 2000000))
// console.log(partTwo(testData))
console.log(partTwo(data, 4000000))
