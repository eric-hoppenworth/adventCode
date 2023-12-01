import data from './input.ts'
import testData from './test.ts'
import testData2 from './test2.ts'

const parseInput = (input: string): any => {
  return input.split('\n')
}


const processLine = (line: string): number => {
  return parseInt(getMatch(line, 'start') + getMatch(line, 'end'))
}

const getMatch = (line: string, position: 'start' | 'end'): string => {
  const map: Record<string, string> = {
    'one': '1',
    'two': '2',
    'three': '3',
    'four': '4',
    'five': '5',
    'six': '6',
    'seven': '7',
    'eight': '8',
    'nine': '9',
  };
  const numberMatch = `([\\d]|${Object.keys(map).join('|')})`
  const regex = new RegExp(
    (position === 'end' ? '^.*' : '') + numberMatch + (position === 'start' ? '' : '.*$')
  )
  const value = (line.match(regex) || [])[1] || '0'
  return map[value] || value
}


const main = (input: string): number => {
  return parseInput(input).map(processLine).reduce((c: number, a: number): number => c + a, 0)
}

console.log(main(data))
// console.log(main(testData2))
