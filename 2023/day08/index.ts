import data from './input.ts'
import testData from './test.ts'
import testData2 from './test2.ts'


type Node = {
    id: string;
    L: string;
    R: string;
}
type NodeMap = Record<string, Node>
type Direction = 'L' | 'R'

type DesertMap = {
    nodes: NodeMap;
    directions: Direction[];
}

const parseInput = (input: string): DesertMap => {
    const lines = input.split('\n\n')
    const directions = lines[0].split('') as Direction[]

    const nodes: NodeMap = {}
    for (const line of lines[1].split('\n')) {
        // AAA = (BBB, BBB)
        const matches = line.match(/(.{3}) = \((.{3}), (.{3})\)/)
        if (!matches) {
            throw new Error()
        }
        const [a, id, L, R] = matches
        nodes[id] = { id, L, R }
    }
    return { nodes, directions }
}

const processPath = (desertMap: DesertMap, node: string, index: number, check: (a: string) => boolean): { count: number; index: number; node: string; } => {
    let count = 0
    while(!check(node)) {
        if (node.endsWith('Z')) {
            console.log(count)
        }
        if (index >= desertMap.directions.length) {
            index = 0
        }
        const direction = desertMap.directions[index]
        node = desertMap.nodes[node][direction]

        count++
        index++
    }
    return { count, index, node }
}

const gcd = (a: number, b: number): number => !b ? a : gcd(b, a % b)
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b)

const partOne = (input: string): number => {
    const desertMap = parseInput(input)
    return processPath(desertMap, 'AAA', 0, (a) => a === 'ZZZ').count
}
const partTwo = (input: string): number => {
    const desertMap = parseInput(input)
    const nodeList = Object.keys(desertMap.nodes).filter(a => a.endsWith('A'))
    const results = nodeList.map((node) => processPath(desertMap, node, 0, (a) => a.endsWith('Z')))
    console.log(results)
    let steps = 1
    for (let i = 0; i < results.length; i++) {
        steps = lcm(steps, results[i].count)
    }

    return steps
}

// console.log(partOne(data))
console.log(partTwo(data))