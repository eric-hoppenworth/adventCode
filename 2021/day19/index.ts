import data from './input.ts'
import testData from './test.ts'

type Vector = {
    x: number
    y: number
    z: number
}

type Delta = {
    distance: Vector
    beacons: [Beacon, Beacon]
}

type Scanner = {
    id: number
    beacons: Beacon[]
    position?: Vector
    deltas?: Delta[]
    // does this also need position and positionType?
}

type Beacon = {
    position: Vector
    positionType: 'RELATIVE' | 'ABSOLUTE'
    owner?: number
}

const parseInput = (input: string): Scanner[] => {
    const scannerList = input.split('\n\n').map((scannerInput: string): Scanner => {
        const rows = scannerInput.split('\n')
        const id = parseInt(((rows[0] || '').match(/\d{1,}/) || [])[0], 10)
        return {
            id,
            beacons: rows.slice(1).map((beaconInput: string): Beacon => {
                const [ x, y, z ] = beaconInput.split(',')
                return {
                    position: {
                        x: parseInt(x, 10),
                        y: parseInt(y, 10),
                        z: parseInt(z, 10),
                    },
                    positionType: 'RELATIVE',
                }
            })
        }
    })
    scannerList[0].position = { x: 0, y: 0, z: 0 }
    return scannerList
}

// I can write functions for these rotations if needed?
const rotateZ = (v: Vector): Vector => ({ x: -v.y, y:  v.x, z:  v.x })
const rotateX = (v: Vector): Vector => ({ x:  v.x, y: -v.z, z:  v.y })
const rotateY = (v: Vector): Vector => ({ x:  v.z, y:  v.y, z: -v.x })
const getDelta = (v1: Vector, v2: Vector) => ({ x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z })

const partOne = (scannerList: Scanner[]): number => {
    for (const scanner of scannerList) {
        scanner.deltas = []
        for (let i = 0; i < scanner.beacons.length - 1; i++) {
            const beaconA = scanner.beacons[i]
            for (let j = i + 1; j < scanner.beacons.length; j++) {
                const beaconB = scanner.beacons[j]
                scanner.deltas.push({
                    beacons: [beaconA, beaconB],
                    distance: getDelta(beaconA.position, beaconB.position)
                })
            }
        }
    }
    console.log(scannerList[0].deltas)
    console.log(scannerList[1].deltas)
    return 0
}

console.log(partOne(parseInput(testData)))