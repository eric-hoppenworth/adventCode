import data from './input.ts'
import testData from './test.ts'


type Node = {
  length: number;
  id?: number;
}
const parseInput = (input: string): string[] => {
  return input.split('')
}

const partOne = (input: string): number => {
  const blocks = parseInput(input)
  const arr: string[] = []
  let fileId = 0
  for (const index in blocks) {
    if (index % 2) {
      // odd index, free space
      for (let fill = 0; fill < blocks[index]; fill++) {
        arr.push('.')
      }
    } else {
      // even index, file
      for (let fill = 0; fill < blocks[index]; fill++) {
        arr.push(fileId.toString())
      }
      fileId++
    }
  }

  while (arr.includes('.')) {
    for (const index in arr) {
      if (arr[index] === '.') {
        let char = arr.pop()
        while (char === '.') {
          char = arr.pop()
        }
        arr[index] = char
      }
    }
  }
  return arr.reduce((carry, val, index) => {
    return carry + (Number(val) * index)
  }, 0)
}
const partTwo = (input: string): number => {
  const blocks = parseInput(input)
  let nodes: Node[] = []
  let length = 0
  for (const index in blocks) {
    const nodeLength = Number(blocks[index])
    nodes.push({
      length: nodeLength,
      id: index % 2 ? undefined : Math.floor(index / 2)
    })
    length += nodeLength
  }
  const reversedArray = [...nodes].reverse()
  for (let i = 0; i < reversedArray.length ; i++) {
    const file = reversedArray[i]
    if (file.id === undefined) {
      continue
    }
    console.log(file)

    for (const index in nodes) {
      const node = nodes[index]
      if (node.id !== undefined) {
        continue
      }
      if (node.length > file.length) {
        node.length = node.length - file.length
        // add a new entry to the array at this index
        nodes = [
          ...nodes.slice(0, index),
          file,
          ...nodes.slice(index)
        ]
        file.id = undefined
        break
      } else if (node.length === file.length) {
        // edit the entry at this index
        node.id = file.id
        // TODO: remove the file with id...or I can just skip summing it later?
        // no...I need to replace it with empty space so that the files that don't move are in the correct posistion
        file.id = undefined
        break
      }
    }
  }
  console.log(nodes)
  return 0
}

// console.log(partOne(data))
console.log(partTwo(testData))
