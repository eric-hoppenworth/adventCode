import data from './input.ts'
import testData from './test.ts'

type Race = {
  time: number;
  distance: number;
}

type StringRace = {
  time: string;
  distance: string;
}
const parseInput = (input: string): Race[] => {
  const parsed: string[][] = input.split('\n').map(a => a.split(/[\W]/).filter(Boolean))
  const final: Race[] = []
  for (let i = 1; i < parsed[0].length; i++) {
    final.push({
      time: parseInt(parsed[0][i]),
      distance: parseInt(parsed[1][i]),
    })
  }
  return final
}


const getLowestTime = (time: number, distance: number): number =>
  Math.floor((time - Math.sqrt(time * time - 4 * distance)) / 2)


const getTotalWins = (race: Race): number =>
  race.time - 2 * getLowestTime(race.time, race.distance) - 1


const partOne = (input: string): number =>
  parseInput(input).reduce((carry: number, race: Race): number =>
    carry * getTotalWins(race)
  , 1)


const partTwo = (input: string): number => {
  const newRace: StringRace = parseInput(input).reduce((carry: StringRace, race): StringRace => ({
    time: carry.time + race.time.toString(),
    distance: carry.distance + race.distance.toString(),
  }), { time: '', distance: '' })
  return getTotalWins({
    time: parseInt(newRace.time),
    distance: parseInt(newRace.distance),
  })
}

console.log(partOne(data))
console.log(partTwo(data))
