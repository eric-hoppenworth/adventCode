import data from './input.ts'
import testData from './test.ts'

type SpringRow = {
    length: number;
    groups: string[]; // # | ?
    numbers: number[];
}
const parseInput = (input: string): SpringRow[] => {
    return input.split('\n').map(a => {
        const [line, groups] = a.split(' ')
        return {
            length: a.length,
            groups: line.split('.').filter(Boolean),
            numbers: groups.split(',').map(b => parseInt(b))
        }
    })
}
const evaluateRow = (row: SpringRow): number => {
    // first, assign any groups with now "?"
    // these groups can then be removed (i.e. spliced) from both lists
    if (row.groups.length > row.numbers.length) {
        console.log(row)
    }

    return 0
}
const partOne = (input: string): number => {
    return parseInput(input).reduce((carry, row) => carry + evaluateRow(row), 0)
}
const partTwo = (input: string): number => {
    return 0
}

console.log(partOne(data))

// ????????????? 1,5,1,1
// #. #####. #. #
//
// ?###???????? 3,2,1`
// ???????
// ##. # =>  three blanks (order does not matter), 2 non-blank (order matters)
// nCr(3 + 2, 3) = 10 ()