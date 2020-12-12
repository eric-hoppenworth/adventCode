const fs = require('fs')

fs.readFile('./puzzle.txt', 'utf8', function(err, data) {
    data = data
        .split(require('os').EOL)
        .map(item => parseInt(item))

    // console.log(partOne(data));
    console.log(partTwo(data));
});

function partOne(data) {
    data.sort((a,b) => a > b ? 1 : a < b ? -1 : 0)
    data.unshift(0)
    let differences = {
        1: 0,
        3: 1
    }
    for (let i = 0; i < data.length - 1; i++) {
        let j = i + 1
        differences[data[j] - data[i]]++
    }
    return differences[1] * differences[3]
}

function partTwo(data) {
    data.sort((a,b) => a > b ? 1 : a < b ? -1 : 0)
    data.unshift(0)
    data.push(data[data.length - 1] + 3)
    let ncrMap = {
        0: 1,
        1: 1,
        2: 2,
        3: 4,
        4: 7
    };
    let onesInARow = 0
    const products = []
    for (let i = 0; i < data.length - 1; i++) {
        let j = i + 1
        if (data[j] - data[i] === 1) {
            onesInARow++
        } else {
            // i broke the cycle, so put a new value in the 'products'
            if (onesInARow > 1) {
                products.push(ncrMap[onesInARow])
            }
            onesInARow = 0
        }
    }
    return products.reduce((carry, item) => carry * item, 1)
}

