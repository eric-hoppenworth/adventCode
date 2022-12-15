import data from './input.ts'
import testData from './test.ts'

type Monkey = {
  index: number;
  items: number[];
  operation: (worry: number) => number;
  test: (worry: number) => number;
  inspections: number;
  divisor: number;
}
const getMatch = (line: string, regex: RegExp): string => (line.match(regex) || [])[1] || ''
const parseInput = (input: string): Monkey[] => {
  return input.split('\n\n').map((line: string) => {
    const divisor = getMatch(line, /Test: divisible by (.*)$/m)
    const trueResult = getMatch(line, /If true: throw to monkey (.)$/m)
    const falseResult = getMatch(line, /If false: throw to monkey (.)$/m)
    return {
      index: parseInt(getMatch(line, /Monkey ([\d]):$/m), 10),
      items: getMatch(line, /Starting items: (.*)$/m).split(',').map(a => parseInt(a, 10)),
      operation: new Function("old", "return " + getMatch(line, /Operation: new = (.*)$/m)) as (worry: number) => number,
      test: new Function("a", `return (a % ${divisor}) === 0 ? ${trueResult} : ${falseResult}`) as (worry: number) => number,
      inspections: 0,
      divisor: parseInt(divisor, 10),
    }
  })
}

const partOne = (input: string, roundCount: number, worryDivisor: number = 1): number => {
  const monkeys = parseInput(input)
  const sharedDivisor: number = monkeys.reduce((carry, monkey) => carry * monkey.divisor , 1)
  for (let i = 1; i <= roundCount; i++) {
    monkeys.forEach((monkey: Monkey) => {
      monkey.items.forEach((item: number) => {
        let value = Math.floor(monkey.operation(item) / worryDivisor)
        const recipient = monkey.test(value)
        value = value % sharedDivisor || value
        monkeys[recipient].items.push(value)
        monkey.inspections++
      })
      monkey.items = []
    })
  }
  const mostBusy: number[] = monkeys.map((monkey): number => monkey.inspections).sort((a, b) => a < b ? 1 : -1).slice(0, 2)
  return mostBusy[0] * mostBusy[1]
}

// console.log(partOne(data, 20, 3))
console.log(partOne(data, 10000, 1))
