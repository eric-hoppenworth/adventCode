import data from './input.ts'
import testData from './test.ts'

type Monkey = {
  name: string;
  value: number;
  others: string[];
  method: Operation;
}
type MonkeyMap = {
  [key: string]: Monkey;
}
type Operation = (a: number, b: number) => number
const operationMap: { [key: string]: Operation } = {
  '+': (a: number, b: number) => a + b,
  '/': (a: number, b: number) => a / b,
  '*': (a: number, b: number) => a * b,
  '-': (a: number, b: number) => a - b,
}

const parseInput = (input: string): any => {
 const list: MonkeyMap = {}
 input.split('\n').forEach((line: string) => {
   const regex = /^([a-z]{4}): (?:([\d]{1,})|([a-zA-Z]{4}) ([+\/\-*]) ([a-zA-Z]{4}))$/
   const matches = line.match(regex)
   if (!matches) {
     throw new Error()
   }
   const monkey = {
     name: matches[1],
     value: parseInt(matches[2] || '0', 10),
     others: [matches[3] || '', matches[5] || ''],
     method: operationMap[matches[4] || '+'] as Operation,
   }
   list[monkey.name] = monkey
 })
 return list
}

const getMonkeyValue = (list: MonkeyMap, monkey: Monkey): number => {
  if (monkey.name === 'humn') {
    return 3375719472770
  }
  if (monkey.value) {
    return monkey.value
  }
  return monkey.method(...(monkey.others.map(a => getMonkeyValue(list, list[a])) as [number, number]))
}

const partOne = (input: string): number => {
  const monkeys = parseInput(input)
  return getMonkeyValue(monkeys, monkeys['root'])
}

const partTwo = (input: string): number => {
  const monkeys = parseInput(input)
  // const values = [getMonkeyValue(monkeys, monkeys[monkeys['root'].others[0]]), getMonkeyValue(monkeys, monkeys[monkeys['root'].others[1]])]
  console.log(getMonkeyValue(monkeys, monkeys[monkeys['root'].others[0]]))
  console.log(getMonkeyValue(monkeys, monkeys[monkeys['root'].others[1]]))
  return 1
}
// console.log(partOne(data))
console.log(partTwo(data))
