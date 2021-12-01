import data from './input.ts'
import testData from './test.ts'

const main = (inputString: string, WINDOW_SIZE: number): number => {
  const depths : number[] = inputString.split('\n').map((depth: string) => {
    return parseInt(depth, 10)
  })
  let count = 0
  for (let i = 0; i < depths.length - WINDOW_SIZE; i++) {
    // I can optimize this the same way we did on that binary search problem
    // the adjacent windows will contain the same middle numbers (only the outside numbers will contribute the the increase)
    // that means I can just compare i to i + WINDOW_SIZE
    count += Number(depths[i + WINDOW_SIZE] > depths[i])
  }
  return count
}

const partOne = () => main(data, 1)
const partTwo = () => main(data, 3)
const testRun = () => main(testData, 3)

console.log(partTwo());
