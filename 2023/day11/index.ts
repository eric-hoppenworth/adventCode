import data from './input.ts'
import testData from './test.ts'

type SpaceMap = string[][]
type Location = { row: number; col: number; }
const parseInput = (input: string): SpaceMap => {
    return input.split('\n').map(a => a.split(''))
}
const transpose = <T>(arr: T[][]): T[][] => arr[0].map((_, colIndex) => arr.map(row => row[colIndex]));

const expandRows = (map: SpaceMap): SpaceMap => {
    const expandedMap: SpaceMap = []
    for (const row of map) {
        if (!row.join('').match(/#/)) {
            expandedMap.push([...row])
        }
        expandedMap.push([...row])
    }
    return expandedMap
}
const expand = (map: SpaceMap): SpaceMap => {
    return expandRows(transpose(expandRows(transpose(map))))
}
const manhattenDistance = (a: Location, b: Location): number => {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col)
}
const getLocations = (map: SpaceMap): Location[] => {
    const locations: Location[] = []
    map.forEach((line, row) => {
        line.forEach((cell, col) => {
            if (cell === '#') {
                locations.push({ row, col })
            }
        })
    })
    return locations
}
const sumDistances = (locations: Location[]): number => {
    let sum = 0
    for (let i = 0; i < locations.length - 1; i++) {
        for (let j = i + 1; j < locations.length; j ++) {
            sum += manhattenDistance(locations[i], locations[j])
        }
    }
    return sum
}
const getEmptyRows = (map: SpaceMap): number[] => {
    return map.map((line, index) => {
        return line.join('').match(/#/) ? null : index
    }).filter(a => a !== null) as number[]
}
const getEmptyCols = (map: SpaceMap): number[] => {
    return getEmptyRows(transpose(map))
}
const adjustLocation = (loc: Location, rows: number[], cols: number[], adjustment: number): Location => {
    return {
        row: loc.row + (rows.filter(a => a < loc.row).length) * (adjustment - 1),
        col: loc.col + (cols.filter(a => a < loc.col).length) * (adjustment - 1),
    }
}

const partOne = (input: string): number => {
    const map = expand(parseInput(input))
    const locations = getLocations(map)
    return sumDistances(locations)
}
const partTwo = (input: string): number => {
    const map = parseInput(input)
    const rows = getEmptyRows(map)
    const cols = getEmptyCols(map)
    const locations = getLocations(map).map((a) => adjustLocation(a, rows, cols, 1000000))
    return sumDistances(locations)
}

// console.log(partOne(data))
console.log(partTwo(data))