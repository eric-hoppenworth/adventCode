const fs = require('fs')

fs.readFile('./test.txt', 'utf8', function(err, data) {
    data = data
        .split(require('os').EOL)
    // console.log(partOne(data));
    console.log(partTwo(data));
});

function partOne(data) {
    const target = data[0]
    const buses = data[1].split(',').filter(item => item !== 'x')
    let shortestWait = Infinity
    let bestBus = null
    buses.forEach((bus) => {
        let wait = bus - (target % bus)
        if (wait < shortestWait || !bestBus) {
            bestBus = bus
            shortestWait = wait
        }
    })
    return bestBus*shortestWait
}

function partTwo(data) {
    const buses = data[1].split(',').map((item, index) => {
        if (item === 'x') {
            return false
        }
        return {
            slope: parseInt(item),
            intercept: index*-1,
        }
    }).filter(Boolean)

    while(buses.length >= 2) {
        let busA = buses.shift()
        let busB = buses.shift()
        let combo = getCycleInfo(busA, busB);
        console.log(combo);
        buses.unshift(combo)
    }
    return buses
}

function getCycleInfo(busA, busB) {
    for (let i = 1; i <= Math.max(busA.slope, busB.slope); i++) {
        if ((busB.slope*i + busB.intercept - busA.intercept) % busA.slope === 0) {
            return {
                intercept: busB.slope*i + busB.intercept,
                slope: busB.slope * busA.slope
            }
        }
    }
}
