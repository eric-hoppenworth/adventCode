import data from './input.ts'
import testData from './test.ts'



const checkMarker = (marker: string): boolean => {
    const map: Record<string, number> = {}
    for(let i = 0; i < marker.length; i++) {
      if (map[marker[i]]) {
        return false
      }
      map[marker[i]] = 1
    }
    return true
}

const partOne = (input: string, markerLength = 4): number => {
  let marker: string = input.slice(0, markerLength - 1)
  const signal: string = input.slice(markerLength - 1)
  for(let i = 0; i < signal.length; i++) {
    marker = (marker + signal[i]).slice(-1 * markerLength)
    if (checkMarker(marker)) {
      return i + markerLength
    }
  }
  return 0
}

// console.log(partOne(data))
console.log(partOne(data, 14))
