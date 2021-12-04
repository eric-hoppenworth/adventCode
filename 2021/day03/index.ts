import data from './input.ts'
import testData from './test.ts'

type binaryTree = {
  '0': string[];
  '1': string[];
  [key: string]: string[];
}


const partOne = (input: string): number => {
  const positionSums: number[] = []
  const list = input.split('\n')
  list.forEach((diagnosticOutput:string) => {
    for (let index = 0; index < diagnosticOutput.length; index++) {
      positionSums[index] = (positionSums[index] || 0) + parseInt(diagnosticOutput[index], 10)
    }
  });
  const half = list.length / 2
  const gammaRate: string = positionSums.reduce((carry: string, count: number): string => {
    if (count > half) {
      return carry + '1'
    }
    return carry + '0'
  }, '');
  const epsilonRate: string = positionSums.reduce((carry: string, count: number): string => {
    if (count > half) {
      return carry + '0'
    }
    return carry + '1'
  }, '');
  return parseInt(gammaRate, 2) * parseInt(epsilonRate, 2)
}

const partTwo = (input: string): number => {
  let index = 0;
  const oxygenGeneratorReducer = (list: string[], index: number): string[] => {
    const tree: binaryTree = {
      '0': [],
      '1': [],
    }
    list.forEach((diagnosticOutput:string) => {
      tree[diagnosticOutput[index]].push(diagnosticOutput)
    })
    return tree['0'].length > tree['1'].length ? tree['0'] : tree['1']
  }
  const co2GeneratorReducer = (list: string[], index: number): string[] => {
    const tree: binaryTree = {
      '0': [],
      '1': [],
    }
    list.forEach((diagnosticOutput:string) => {
      tree[diagnosticOutput[index]].push(diagnosticOutput)
    })
    return tree['0'].length <= tree['1'].length ? tree['0'] : tree['1']
  }
  let result = 1;
  let list: string[] = input.split('\n')
  while (list.length > 1) {
    list = oxygenGeneratorReducer(list, index);
    index++
  }
  result *= parseInt(list[0],2)
  list = input.split('\n')
  index = 0
  while (list.length > 1) {
    list = co2GeneratorReducer(list, index);
    index++
  }
  result *= parseInt(list[0],2)
  return result
}


console.log(partTwo(data));
