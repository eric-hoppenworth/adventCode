const fs = require('fs')
fs.readFile('./puzzle.txt', 'utf8', function(err, data) {
    data = data.split(require('os').EOL).map(item => {
        item = item.replace(':','').split(' ')
        const minMax = item[0].split('-')
        return {
            min: parseInt(minMax[0]),
            max: parseInt(minMax[1]),
            letter: item[1],
            password: item[2]
        }
    });

    // console.log(partOne(data));
    console.log(partTwo(data));
});

function partOne(data) {
    let validCount = 0
    data.forEach(item => {
        const regex = new RegExp('['+item.letter+']', 'g')
        const matches = (item.password.match(regex) || []).length
        if (matches >= item.min && matches <= item.max) {
            validCount++
        }
    })
    return validCount;
}

function partTwo(data) {
    let validCount = 0
    data.forEach(item => {
        if ((item.password[item.min-1] === item.letter) ^ (item.password[item.max-1] === item.letter)) {
            validCount++
        }
    })
    return validCount;
}
