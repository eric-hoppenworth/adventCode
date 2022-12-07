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
const getDirectorySizes = (tree: Tree): { [key: string]: number } => {
  const directories: { [key: string]: number } = {}
  const getDirectorySize = (tree: Tree): number => {
    let total = 0
    for (const [key, value] of Object.entries(tree)) {
      if (typeof value === 'number') {
        total += value
      } else {
        const directorySize = getDirectorySize(value)
        if (!directories[key]) {
          directories[key] = directorySize
        } else {
          console.log('already exists')
          console.log(key)
        }
        total += directorySize
      }
    }
    return total
  }
  const root = getDirectorySize(tree)
  directories['root'] = root
  return directories
}



const partOne = (input: string): number => {
  const tree = parseInput(input)
  console.log(tree)
  const directories = getDirectorySizes(tree)
  console.log(directories)
  console.log(Object.values(directories).length)
  let total = 0
  for (const value of Object.values(directories)) {
    if (value < 100000) {
      total += value
    }
  }
  return total
}

console.log(partOne(test))
