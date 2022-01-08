import data from './input.ts'
import testData from './test.ts'

enum INSTRUCTION {
    INPUT = 'inp',
    ADD = 'add',
    MULTIPLY = 'mul',
    DIVIDE = 'div',
    MOD = 'mod',
    EQUAL = 'eql',
}
enum VARIABLE {
    x = 'x',
    y = 'y',
    z = 'z',
    w = 'w',
}

type ALU = {
    [key in VARIABLE]?: number
}
type Monad = number[]
type Instruction = {
    operator: INSTRUCTION
    left: VARIABLE
    rightName?: VARIABLE
    right?: number
}

const parseInput = (input: string): Instruction[] => {
    return input.split('\n').map((instruc: string) => {
        const [op, left, rightString] = instruc.split(' ')
        const operator = Object.entries(INSTRUCTION).find((a) => op === a[1])
        if (!operator || !operator[1]) {
            throw new Error()
        }
        const leftOperand = Object.entries(VARIABLE).find((a) => left === a[1])
        if (!leftOperand || !leftOperand[1]) {
            throw new Error()
        }
        let right: number | undefined
        let rightName: VARIABLE | undefined
        if (rightString) {
            if (parseInt(rightString, 10) || parseInt(rightString, 10) === 0) {
                right = parseInt(rightString, 10)
            } else {
                let rightOperand = Object.entries(VARIABLE).find((a) => rightString === a[1])
                if (!rightOperand || !rightOperand[1]) {
                    throw new Error()
                }
                rightName = rightOperand[1]
            }
        }
        return {
            operator: operator[1],
            left: leftOperand[1],
            right: right,
            rightName: rightName,
        }
    })
}

const doInput = (alu: ALU, left: VARIABLE, monad: Monad) => {
    // pull the first number off of the input (MONAD) array and place it into the alu
    const val = monad.shift() || 0
    if (val === 0) {
        throw new Error()
    }
    alu[left] = val
}

const doAddVariable = (alu: ALU, left: VARIABLE, right: VARIABLE) => {
    alu[left] = (alu[left] || 0) + (alu[right] || 0)
}
const doAdd = (alu: ALU, left: VARIABLE, right: number) => {
    alu[left] = (alu[left] || 0) + right
}

const doMultiplyVariable = (alu: ALU, left: VARIABLE, right: VARIABLE) => {
    alu[left] = (alu[left] || 1) * (alu[right] || 1)
}
const doMultiply = (alu: ALU, left: VARIABLE, right: number) => {
    alu[left] = (alu[left] || 1) * right
}

const doDivideVariable = (alu: ALU, left: VARIABLE, right: VARIABLE) => {
    if (!alu[right]) {
        throw new Error()
    }
    alu[left] = Math.trunc((alu[left] || 1) / (alu[right] || 1))
}
const doDivide = (alu: ALU, left: VARIABLE, right: number) => {
    if (right === 0) {
        throw new Error()
    }
    alu[left] = Math.trunc((alu[left] || 1) / right)
}

const doModVariable = (alu: ALU, left: VARIABLE, right: VARIABLE) => {
    if (alu[left] < 0) {
        throw new Error()
    }
    if (alu[right] <= 0) {
        throw new Error()
    }
    alu[left] = (alu[left] || 1) % (alu[right] || 1)
}
const doMod = (alu: ALU, left: VARIABLE, right: number) => {
    if (alu[left] < 0) {
        throw new Error()
    }
    if (right <= 0) {
        throw new Error()
    }
    alu[left] = (alu[left] || 1) % right
}

const doEqualVariable = (alu: ALU, left: VARIABLE, right: VARIABLE) => {
    alu[left] = (alu[left] || 1) === (alu[right] || 1) ? 1 : 0
}
const doEqual = (alu: ALU, left: VARIABLE, right: number) => {
    if (alu[left] < 0) {
        throw new Error()
    }
    if (right <= 0) {
        throw new Error()
    }
    alu[left] = (alu[left] || 1) === right ? 1 : 0
}


const doOperation = () => {
    // "switch" between instructions and the type of "right"
}
// console.log(parseInput(data))

const alu: ALU = { x: 10 }
doAdd(alu, VARIABLE.x, 11)
console.log(alu)
alu.y = 3
doAddVariable(alu, VARIABLE.x, VARIABLE.y)
console.log(alu)
