const fs = require('fs')
// const PREAMBLE_LENGTH = 5;
const PREAMBLE_LENGTH = 25;

fs.readFile('./puzzle.txt', 'utf8', function(err, data) {
    data = data
        .split(require('os').EOL)
        .map(item => parseInt(item))

    // console.log(partOne(data));
    console.log(partTwo(data));
});

function partOne(data) {
    let sums = [];
    function nextValue(value) {
        if (sums.length === PREAMBLE_LENGTH) {
            sums.shift()
        }
        sums.forEach(item => {
            if (item.value !== value) {
                item.sums.push(item.value + value)
            }
        })
        sums.push({
            value,
            sums: []
        })
    }
    function checkSums(value) {
        for (let i = 0; i < sums.length; i++ ) {
            for (let j = 0; j < sums[i].sums.length; j++) {
                if (sums[i].sums[j] === value) {
                    return false
                }
            }
        }
        return true
    }
    for (let i = 0; i < data.length; i++) {
        if (sums.length === PREAMBLE_LENGTH) {
            if (checkSums(data[i])) {
                return data[i]
            }
        }
        nextValue(data[i])
    }

    return 'nothing'
}

function partTwo(data) {
    const target = partOne(data)
    let sums = []
    function calculateTotal(sums) {
        return sums.reduce((carry, value) => carry + value, 0)
    }

    while(data.length) {
        let total = calculateTotal(sums)
        if (total < target) {
            // push the next number onto the array nad remove it from the original list
            sums.push(data.shift())
        } else if (total > target) {
            // remove the front of the array
            sums.shift()
        } else {
            return sums.reduce((carry, value) => value < carry ? value : carry, Infinity) + sums.reduce((carry, value) => value > carry ? value : carry, 0)
        }
    }
    return 'nothing'
}

