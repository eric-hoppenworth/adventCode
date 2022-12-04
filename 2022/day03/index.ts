import data from './input.ts'
import testData from './test.ts'

type Compartment = string
type Rucksack = [Compartment, Compartment]
type MappedCompartment = { [key: string]: number }
type MappedRucksack = [MappedCompartment, MappedCompartment]
type Group = [Compartment, Compartment, Compartment]
type MappedGroup = [MappedCompartment, MappedCompartment, MappedCompartment]

const parseInput = (input: string): Rucksack[] => {
  return input.split('\n').map((line) => {
    const halfLength = line.length / 2
    return [line.slice(0, halfLength), line.slice(halfLength)]
  })
}

const getPriority = (item: string): number => {
  let code: number = item.charCodeAt(0)
  if (code < 96) {
    code += 58
  }
  return code - 96
}
const mapRucksack = (rucksack: Rucksack): MappedRucksack => rucksack.map(mapCompartment) as MappedRucksack

const mapCompartment = (compartment: Compartment): MappedCompartment => {
  const map: MappedCompartment = {}
  for (let i = 0; i < compartment.length; i++) {
    if (!map[compartment[i]]) {
      map[compartment[i]] = 0
    }
    map[compartment[i]]++
  }
  return map
}

const findSharedItem = (rucksack: Rucksack): string => {
  const mappedRucksack: MappedRucksack = mapRucksack(rucksack)
  for (const key in mappedRucksack[0]) {
    if (mappedRucksack[1][key]) {
      return key
    }
  }
  return 'a'
}

const findSharedItems = (compartmentA: MappedCompartment, compartmentB: MappedCompartment): MappedCompartment => {
  const map: MappedCompartment = {}
  for (const key in compartmentA) {
    if (compartmentB[key]) {
      map[key] = 1
    }
  }
  return map
}

const getSharedForGroup = (group: Group): string => {
  const mappedGroup = group.map(mapCompartment)
  const sharedCompartment: MappedCompartment = findSharedItems(findSharedItems(mappedGroup[0], mappedGroup[1]), mappedGroup[2])
  return Object.keys(sharedCompartment)[0]
}

const partOne = (input: string): number => {
  const rucksacks = parseInput(input)
  const sharedItems: string[] = rucksacks.map(findSharedItem)
  return sharedItems.reduce((carry, item) => carry + getPriority(item), 0)
}

const partTwo = (input: string): number => {
  const parsedInput: Rucksack[] = parseInput(input)
  // NOTE: I treat each bag now as a single compartment
  const groups: [Compartment, Compartment, Compartment][] = []
  let groupIndex = -1
  for (let i = 0; i < parsedInput.length; i++) {
    if (!(i % 3)) {
      groups.push([] as unknown as Group)
      groupIndex += 1
    }
    groups[groupIndex].push(parsedInput[i].join(''))
  }
  return groups.map(getSharedForGroup).reduce((carry, item) => carry + getPriority(item) , 0)
}

// console.log(partOne(data))
console.log(partTwo(data))
