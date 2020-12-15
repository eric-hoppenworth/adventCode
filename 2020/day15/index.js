const fs = require('fs')

fs.readFile('./puzzle.txt', 'utf8', function(err, data) {
    data = data
        .split(',')
    console.log(partOne(data))
    // console.log(partTwo(data))
})
function playGame(turnLimit) {
    const game = {}
    let i = 1
    let previousNumber = null
    while(true) {
        let currentNumber = null
        if (i <= data.length) {
            currentNumber = data[i-1]
            game[currentNumber] = [i]
        } else {
            if (game[previousNumber].length === 1) {
                currentNumber = 0
            } else {
                let prev = game[previousNumber]
                currentNumber = prev[prev.length - 1] - prev[prev.length - 2]
            }
            if (!game[currentNumber]) {
                game[currentNumber] = []
            }

            game[currentNumber].push(i)
        }
        previousNumber = currentNumber
        if(i === turnLimit) {
            return previousNumber
        }
        i++
    }
}

function partOne(data) {
    return playGame(2020)
}

function partTwo(data) {
    return playGame(30000000)
}
