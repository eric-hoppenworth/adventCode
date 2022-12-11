import data from './input.ts'
import testData from './test.ts'

type File = number
type Tree = {
  [key: string]: Tree | File;
}

const parseInput = (input: string): Tree => {
  const tree = {}
  let path: string[] = []
  const commands = input.split('\n')
  commands.forEach(command => {
    const match = command.match(/([\S]*)? ([\S]*)?[ ]?(.*)?/)
    if (!match) {
      return
    }
    if (match[1] === '$') {
      if (match[2] === 'cd') {
        switch (match[3]) {
          case '/':
            path = []
            break
          case '..':
            path.pop()
            break
          default:
            path.push(match[3])
        }
      }
      return
    }
    if (match[1] === 'dir') {
      (resolvePath(tree, path) as Tree)[match[2]] = {}
      return
    }
    (resolvePath(tree, path) as Tree)[match[2]] = parseInt(match[1], 10)
  })
  return tree
}


const resolvePath = (tree: Tree, path: string[]): Tree | File => {
  let pointer: Tree | number = tree
  for (let i = 0; i < path.length; i++) {
    if (typeof pointer === 'number') {
      throw new Error()
    }
    pointer = pointer[path[i]];
  }
  return pointer
}
const getDirectorySizes = (tree: Tree): number[] => {
  const directories: number[] = []
  const getDirectorySize = (tree: Tree): number => {
    let total = 0
    for (const [key, value] of Object.entries(tree)) {
      if (typeof value === 'number') {
        total += value
      } else {
        const directorySize = getDirectorySize(value)
        directories.push(directorySize)
        total += directorySize
      }
    }
    return total
  }
  const root = getDirectorySize(tree)
  directories.push(root)
  return directories
}



const partOne = (input: string): number => {
  const tree = parseInput(input)
  const directories = getDirectorySizes(tree)
  let total = 0
  for (const value of directories) {
    if (value < 100000) {
      total += value
    }
  }
  return total
}

const partTwo = (input: string): number => {
  const tree = parseInput(input)
  const directories = getDirectorySizes(tree)
  const unusedSpace = 70000000 - directories[directories.length - 1]
  const spaceNeeded = 30000000 - unusedSpace
  return Math.min(...directories.filter(size => size >= spaceNeeded))
}

// console.log(partOne(data))
console.log(partTwo(data))
