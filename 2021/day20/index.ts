import data from './input.ts'
import testData from './test.ts'

const OFF = '.'
const ON = '#'

type Vector = {
    col: number
    row: number
}

type Image = Map<number, Map<number, number>>
type ParsedInput = {
    image: Image
    cypher: string
}

const parseInput = (input: string): ParsedInput => {
    const [ cypher, imageString ] = input.split('\n\n')
    const image: Image = new Map()
    imageString.split('\n').forEach((row: string, rowIndex: number) => {
        const rowMap = new Map()
        image.set(rowIndex, rowMap)
        row.split('').forEach((cell: string, colIndex: number) => {
            rowMap.set(colIndex, cell === ON ? 1 : 0)
        })
    })

    return {
        cypher,
        image,
    }
}

// right now, I am assuming that if I can't see it, it is OFF
// however, I actually need to give it a default(?) since the places I can't see might actually be ON
const getValueFromImage = (image: Image, location: Vector, defaultValue: number = 0): number => {
    const row: Map<number, number> | undefined = image.get(location.row)
    if (!row) {
        return defaultValue
    }
    return row.has(location.col) ? row.get(location.col) as number : defaultValue
}

const getEnhancementIndex = (image: Image, location: Vector, defaultValue: number = 0): number => {
    let result: string = ''
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            result += getValueFromImage(image, { row: location.row + i, col: location.col + j }, defaultValue)
        }
    }
    return parseInt(result, 2)
}

const getValueFromCypher = (cypher: string, index: number): number => {
    return cypher[index] === ON ? 1 : 0
}

const enhanceImage = ({ image, cypher }: ParsedInput, step: number): Image => {
    const newImage: Image = new Map()
    const minRow = Math.min(...image.keys())
    const maxRow = Math.max(...image.keys())
    const defaultValue = cypher[0] === ON ? step % 2 : 0// this needs to be calculated based on the cypher (and current step)
    for (let i = minRow - 1; i <= maxRow + 1; i++) {
        const rowMap: Map<number, number> = image.get(i) || new Map()
        const newRowMap = new Map()
        newImage.set(i, newRowMap)
        for (let j = minRow - 1; j <= maxRow + 1; j++) {
            newRowMap.set(j, getValueFromCypher(cypher, getEnhancementIndex(image, { row: i, col: j }, defaultValue)))
        }
    }
    return newImage
}
const printImage = (image: Image): string => {
    let result = ''
    const minRow = Math.min(...image.keys())
    const maxRow = Math.max(...image.keys())
    for (let i = minRow; i <= maxRow; i++) {
        const rowMap: Map<number, number> = image.get(i) || new Map()
        const minCol = Math.min(...rowMap.keys())
        const maxCol = Math.max(...rowMap.keys())
        for (let j = minCol; j <= maxCol; j++) {
            result += getValueFromImage(image, { row: i, col: j }) ? ON : OFF
        }
        result += '\n'
    }
    return result
}

const countPixels = (image: Image): number => {
    let result = 0
    for (const [index, row] of image) {
        for (const [index, cell] of row) {
            result += cell
        }
    }
    return result
}

const partOne = (input: ParsedInput): number => {
    for (let i = 0; i < 2; i++) {
        input.image = enhanceImage(input, i)
    }
    return countPixels(input.image)
}

const partTwo = (input: ParsedInput): number => {
    for (let i = 0; i < 50; i++) {
        input.image = enhanceImage(input, i)
    }
    return countPixels(input.image)
}

// console.log(partOne(parseInput(testData)))
console.log(partTwo(parseInput(data)))