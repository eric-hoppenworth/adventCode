const fs = require('fs')

fs.readFile('./test.txt', 'utf8', function(err, data) {
    data = data.split('').map(item => parseInt(item, 10))
    // console.log(partOne(data))
    console.log(partTwo(data))
})

function nextCup(cups, index) {
    return (index + 1) % cups.length
}
function getDestinationCup(cups, cupValue, max = 9) {
    // TODO: I should optimize this so that it actual searches the small 3-cup array to determine the next cup
    let destination = cupValue - 1
    while(true) {
        if (destination < 0) {
            destination = max
        }
        if (cups.includes(destination)) {
            return cups.indexOf(destination)
        }
        destination--
    }
}
function removeCups(cups, index) {
    const distance = 3
    let removedCups = cups.splice(index + 1, distance)
    if (removedCups.length < distance) {
        removedCups = removedCups.concat(cups.splice(0, distance - removedCups.length))
    }
    return {
        shortCups: cups,
        removedCups
    }
}

function partOne(data) {
    const rounds = 100
    let currentCupIndex = 0
    let cups = [...data]
    for (let i = 0; i < rounds; i++) {
        let currentCup = cups[currentCupIndex]
        let {shortCups, removedCups} = removeCups([...cups], currentCupIndex)
        let destination = getDestinationCup(shortCups, currentCup)
        shortCups.splice(destination + 1, 0, ...removedCups)
        cups = shortCups
        currentCupIndex = nextCup(cups, cups.indexOf(currentCup))
    }

    return cups.join(' ')
}
function partTwo(data) {
    const rounds = 10000000
    let currentCupIndex = 0
    let cups = [...data]
    // populate the array...
    for (let i = 10; i <= 1000000; i++) {
        cups.push(i)
    }
    for (let i = 0; i < rounds; i++) {
        if (!(i % 100)) {
            console.log(i)
        }
        let currentCup = cups[currentCupIndex]
        let {shortCups, removedCups} = removeCups([...cups], currentCupIndex)
        let destination = getDestinationCup(shortCups, currentCup, 1000000)
        shortCups.splice(destination + 1, 0, ...removedCups)
        cups = shortCups
        currentCupIndex = nextCup(cups, cups.indexOf(currentCup))
    }
    let index = cups.indexOf(1)
    return [cups[index+1], cups[index+2]]
}
