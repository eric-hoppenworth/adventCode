const fs = require('fs')

fs.readFile('./puzzle.txt', 'utf8', function(err, data) {
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
        buses.unshift(combo)
    }
    return buses
}

function getCycleInfo(busA, busB) {
    let interceptDifference = busB.intercept - busA.intercept
    let i = Math.floor((busA.slope-interceptDifference)/busB.slope)
    while (true) {
        let remainder = (busB.slope*i + interceptDifference) % busA.slope
        if (remainder === 0) {
            return {
                intercept: busB.slope*i + busB.intercept,
                slope: busB.slope * busA.slope
            }
        } else {
            let increment = Math.floor((busA.slope-remainder)/busB.slope)
            if (increment === 0) {
                i++
            } else {
                i += increment
            }
        }
    }
}
