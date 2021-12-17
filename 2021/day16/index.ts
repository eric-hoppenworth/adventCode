import data from './input.ts'
import testData from './test.ts'

type Packet = {
    type: number
    version: number
    subpackets: Packet[]
    value?: number
}

const firstTest = '8A004A801A8002F478'
const secondTest = '38006F45291200'
const thirdTest = 'EE00D40C823060'

const getBits = (input: string): string => {
    let string = ''
    for (let i = 0; i < input.length; i++) {
        string = string + parseInt(input[i], 16).toString(2).padStart(4, '0')
    }
    return string
}
const getNextPacket = (bits: string, index: number): [Packet, number] => {
    const version = bits.slice(index, index += 3)
    const type = bits.slice(index, index += 3)
    let value = ''
    const subpackets = []
    if (type === '100') {
        while(true) {
            if (bits[index++] === '1') {
                // get the next 4 bits
                value = value + bits.slice(index, index += 4)
            } else {
                value = value + bits.slice(index, index += 4)
                break
            }
        }
    } else {
        // anything other than type 100
        if (bits[index++] === '1') {
            // then the next 11 bits are a number that represents the number of sub-packets immediately contained by this packet.
            const packetCount = parseInt(bits.slice(index, index += 11) , 2)
            while (subpackets.length < packetCount) {
                const [nextPacket, newIndex] = getNextPacket(bits , index)
                subpackets.push(nextPacket)
                index = newIndex
            }
        } else {
            // then the next 15 bits are a number that represents the total length in bits of the sub-packets contained by this packet.
            const length = parseInt(bits.slice(index, index += 15) , 2)
            const finalIndex = index + length
            while (index < finalIndex) {
                const [nextPacket, distance] = getNextPacket(bits.slice(index, finalIndex) , 0)
                subpackets.push(nextPacket)
                index += distance
                if (parseInt(bits.slice(index, finalIndex), 2) === 0) {
                    break
                }
            }
        }
    }
    return [{
        type: parseInt(type, 2),
        version: parseInt(version, 2),
        value: value ? parseInt(value, 2) : 0,
        subpackets: subpackets
    }, index]
}

const sumPacketVersions = (packet: Packet): number => {
    return packet.version + packet.subpackets.reduce((carry: number, subpack: Packet): number => carry + sumPacketVersions(subpack), 0)
}

const getPacketValue = (packet: Packet): number => {
    switch (packet.type) {
        case 0:
            return packet.subpackets.reduce((carry: number, sub: Packet): number => carry + getPacketValue(sub), 0)
        case 1:
            return packet.subpackets.reduce((carry: number, sub: Packet): number => carry * getPacketValue(sub), 1)
        case 2:
            return Math.min(...packet.subpackets.map((sub: Packet): number => getPacketValue(sub)))
        case 3:
            return Math.max(...packet.subpackets.map((sub: Packet): number => getPacketValue(sub)))
        case 4:
            return packet.value || 0
        case 5:
            return getPacketValue(packet.subpackets[0]) > getPacketValue(packet.subpackets[1]) ? 1 : 0
        case 6:
            return getPacketValue(packet.subpackets[0]) < getPacketValue(packet.subpackets[1]) ? 1 : 0
        case 7:
            return getPacketValue(packet.subpackets[0]) === getPacketValue(packet.subpackets[1]) ? 1 : 0
    }
    return 0
}
const partOne = (transmission: string): number => {
    const bits = getBits(transmission)
    const [packet, index] = getNextPacket(bits, 0)
    return sumPacketVersions(packet)
}

const partTwo = (transmission: string): number => {
    const bits = getBits(transmission)
    const [packet, index] = getNextPacket(bits, 0)
    return getPacketValue(packet)
}

// console.log(partOne(data))
console.log(partTwo(data))
