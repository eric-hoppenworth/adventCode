import data from './input.ts'
import testData from './test.ts'

type Calibration = {
  testValue: number;
  values: number[];
}

const parseInput = (input: string): Calibration[] => {
  return input.split('\n').map(line => {
    const [test, rest] = line.split(': ')
    return {
      testValue: parseInt(test),
      values: rest.split(' ').map(Number),
    }
  })
}

const checkLine = (calibration: Calibration): boolean => {
  // evaluate right to left, as I use opposite operations
  const nextValue = calibration.values.pop()
  if (nextValue === undefined) {
    return false
  }
  if (calibration.values.length === 0) {
    if (nextValue === calibration.testValue) {
      return true
    }
    return false
  }
  if (nextValue > calibration.testValue) {
    return false
  }
  const cases = [];
  if ((calibration.testValue % nextValue) === 0) {
    // add the division case
    cases.push({
      testValue: calibration.testValue / nextValue,
      values: [...calibration.values],
    })
  }
  cases.push({
    testValue: calibration.testValue - nextValue,
    values: [...calibration.values]
  })
  // change for part one or two
  if (true) {
    if (calibration.testValue.toString().endsWith(nextValue.toString())) {
      cases.push({
        testValue: Number(calibration.testValue.toString().slice(0, -1 * nextValue.toString().length)),
        values: [...calibration.values]
      })
    }
  }
  return cases.some(checkLine)
}

const partOne = (input: string): number => {
  const calibrations = parseInput(input)
  return calibrations.reduce((carry, calibration) => {
    if (checkLine(calibration)) {
      return carry + calibration.testValue
    }
    return carry
  }, 0)
}


console.log(partOne(data))
// no part two, just change the hardcoded true for concat check
