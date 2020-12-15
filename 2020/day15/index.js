const fs = require('fs')

fs.readFile('./test.txt', 'utf8', function(err, data) {
    data = data
        .split(',')
    // console.log(partOne(data))
    console.log(partTwo(data))
})
function playGame(data, turnLimit) {
    const game = {}
    let i = 1
    let previousNumber = null
    while(true) {
        if(i > turnLimit) {
            return previousNumber
        }
        if (i <= data.length) {
            previousNumber = data[i-1]
            game[previousNumber] = i
        } else {
            if (game[previousNumber] === undefined) {
                game[previousNumber] = i - 1
                previousNumber = 0
            } else {
                let currentNumber = game[previousNumber]
                game[previousNumber] = i-1
                previousNumber = (i-1) - currentNumber
            }
        }
        i++
    }
}

function partOne(data) {
    return playGame(data, 2020)
}

function partTwo(data) {
    return playGame(data, 30000000)
}
