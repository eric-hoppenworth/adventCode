const fs = require('fs')

fs.readFile('./puzzle.txt', 'utf8', function(err, data) {
    data = data
        .split(require('os').EOL + require('os').EOL)
        .map(item => item.split(require('os').EOL))
    // console.log(partOne(data));
    console.log(partTwo(data));
});

function partOne(data) {
    return data.reduce((carry, item) => {
        return carry + new Set(item.join('')).size
    }, 0)
}

function partTwo(data) {
    return data.reduce((carry, list) => {
        const firstEntry = list[0]
        if (list.length === 1) {
            return carry + firstEntry.length
        }
        let count = 0;
        for (let i = 0; i < firstEntry.length; i++) {
            count += list.every((person) => {
                return person.includes(firstEntry[i])
            })
        }
        return carry + count
    }, 0)
}
