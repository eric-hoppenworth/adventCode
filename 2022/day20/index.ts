import data from './input.ts'
import testData from './test.ts'

type Element = {
  originalPosition: number;
  value: number;
  position: number;
}
type PositionedElementMap = {
  [x: number]: Element;
}
const parseInput = (input: string, encryptionKey: number = 1): Element[] => {
  return input.split('\n').map((value, index) => ({
    originalPosition: index,
    value: parseInt(value, 10) * encryptionKey,
    position: index,
  }))
}

const getOtherNewPosition = (element: Element, length: number): number => {
  let distance = element.value % (length - 1)
  let newPosition = element.position + distance
  if (newPosition < 0) {
    newPosition = newPosition - 1 + length
  } else if (newPosition >= length) {
    newPosition = (newPosition + 1) % length
  }
  if (newPosition === 0) {
    newPosition = length - 1
  }
  if (newPosition === length) {
    newPosition = 0
  }
  return newPosition
}

const getMap = (list: Element[]): PositionedElementMap => {
  const map: PositionedElementMap = {}
  for (const element of list) {
    map[element.position] = element
  }
  return map
}
const moveElements = (list: Element[]): PositionedElementMap => {
  const map = getMap(list)
  for (const element of list) {
    const newPosition = getOtherNewPosition(element, list.length)
    if (newPosition > element.position) {
      for (let i = element.position + 1; i <= newPosition; i++) {
        const movedElement = map[i]
        movedElement.position--
        map[movedElement.position] = movedElement
        delete map[i]
      }
      element.position = newPosition
      map[element.position] = element
    }
    if (newPosition < element.position) {
      for (let i = element.position - 1; i >= newPosition; i--) {
        const movedElement = map[i]
        movedElement.position++
        map[movedElement.position] = movedElement
        delete map[i]
      }
      element.position = newPosition
      map[element.position] = element
    }
    // if they are equal, we can do nothing
    // console.log([...list].sort((a, b) => a.position < b.position ? -1 : 1).map(a => a.value).join())
  }
  return map
}

const findSolution = (list: Element[], map: PositionedElementMap): number => {
  let value = 0
  let zeroPostion = 0
  for (const element of list) {
    if (element.value === 0) {
      zeroPostion = element.position
      break
    }
  }
  for (const pos of [1000, 2000, 3000]) {
    value += map[(pos + zeroPostion) % list.length].value
  }
  return value
}
const partOne = (input: string): number => {
  const list = parseInput(input)
  const map = moveElements(list)
  return findSolution(list, map)
}
const partTwo = (input: string): number => {
  const list = parseInput(input, 811589153)
  let map = moveElements(list)
  for (let i = 0; i < 9; i++) {
    map = moveElements(list)
  }
  return findSolution(list, map)
}


// console.log(partOne(data))
console.log(partTwo(data))
