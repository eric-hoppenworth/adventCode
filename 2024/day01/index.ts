import data from './input.ts'
import testData from './test.ts'

type List = [number[], number[]]

const parseInput = (input: string): any => {
  const list: List = [[], []]
  input.split('\n').forEach((line: string) => {
    line.split('   ').forEach((v, i) => {
      list[i].push(parseInt(v, 10))
    })
  })

  return list
}

const partOne = (input: List): number => {
  input[0].sort()
  input[1].sort()
  return input[0].reduce((carry, v, index) =>
    carry + Math.abs(input[0][index] - input[1][index])
  , 0)
}
const partTwo = (input: List): number => {
  const countMap: Record<number, number> = {}
  input[1].forEach(v => {
    countMap[v] = (countMap[v] || 0) + 1
  })
  return input[0].reduce((carry, left) => {
    return carry + (left * (countMap[left] || 0))
  }, 0)
}
const input = parseInput(data)
// console.log(partOne(input))
console.log(partTwo(input))
