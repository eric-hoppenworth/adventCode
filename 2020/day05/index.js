const fs = require('fs')

fs.readFile('./puzzle.txt', 'utf8', function(err, data) {
    let regex = new RegExp(require('os').EOL,'mgi')
    data = data
        .replace(/[fl]/mgi, '0')
        .replace(/[br]/mgi, '1')
        .split(require('os').EOL)
        .map(item => parseInt(item, 2))
    console.log(partOne(data));
    console.log(partTwo(data));
});

function partOne(data) {
    return data.reduce((carry, item) => item > carry ? item : carry, 0)
}

function partTwo(data) {
    const lastSeat = partOne(data)
    const firstSeat = lastSeat - data.length
    const total = data.reduce((carry, item) => carry + item, 0)
    const expectedTotal = (firstSeat + lastSeat)*(lastSeat - firstSeat + 1)/2
    return expectedTotal - total
}
