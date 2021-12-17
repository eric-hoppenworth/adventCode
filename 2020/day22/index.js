const fs = require('fs')

fs.readFile('./puzzle.txt', 'utf8', function(err, data) {
    data = data.split(require('os').EOL + require('os').EOL).map(item => item.replace(/Player [12]:\s/, '').split(require('os').EOL).map(item => parseInt(item, 10)))
    // console.log(partOne(data))
    console.log(partTwo(data))
})

function calculateScore(player) {
    return player.reduce((carry, card, index, array) => {
        return carry + (card * (array.length - index))
    }, 0)
}
function partOne(data) {
    let playerOne = data[0]
    let playerTwo = data[1]
    let round = 1
    while (playerOne.length && playerTwo.length) {
        let cardOne = playerOne.shift()
        let cardTwo = playerTwo.shift()
        if (cardOne > cardTwo) {
            playerOne.push(cardOne, cardTwo)
        } else {
            playerTwo.push(cardTwo, cardOne)
        }
        round++
    }
    if (playerOne.length) {
        return calculateScore(playerOne)
    } else {
        return calculateScore(playerTwo)
    }
}


function partTwo(data) {
    const DEBUG = false
    function playRound(data) {
        if (DEBUG) {
            console.log('round start:', data)
        }
        let rounds = []
        let playerOne = data[0]
        let playerTwo = data[1]
        while (playerOne.length && playerTwo.length) {
            let winner = null
            // first, I want to check for infinite recursion
            rounds.forEach(round => {
                if (JSON.stringify(round[0]) === JSON.stringify(playerOne) && JSON.stringify(round[1]) === JSON.stringify(playerTwo)) {
                    winner = true
                }
            })
            // if a game has already been played, player one wins by default
            if (winner) {
                if (DEBUG) {
                    console.log('inner round done')
                }
                return 1
            }

            if (DEBUG) {
                console.log(data)
            }
            rounds.push([[...playerOne],[...playerTwo]])
            let cardOne = playerOne.shift()
            let cardTwo = playerTwo.shift()
            if (DEBUG) {
                console.log(rounds.length)
                console.log(cardOne, cardTwo)
            }

            // first, I want to check if both players have at least as many cards as the value of their own card
            if (playerOne.length >= cardOne && playerTwo.length >= cardTwo) {
                // IF we do have enough cards, we copy them down and play a game to determine the winner
                // TODO: this is where my problem lies!
                let winner = playRound([playerOne.slice(0, cardOne), playerTwo.slice(0,cardTwo)])
                if (winner === 1) {
                    playerOne.push(cardOne, cardTwo)
                } else {
                    playerTwo.push(cardTwo, cardOne)
                }
            } else {
                // if we do not have enough cards we simply compare values
                if (cardOne > cardTwo) {
                    playerOne.push(cardOne, cardTwo)
                } else {
                    playerTwo.push(cardTwo, cardOne)
                }
            }

        }
        if (playerOne.length) {
            if (DEBUG) {
                console.log('inner round done')
            }
            return 1
        } else {
            if (DEBUG) {
                console.log('inner round done')
            }
            return 2
        }
    }
    playRound(data)

    if (data[0].length) {
        return calculateScore(data[0])
    } else {
        return calculateScore(data[1])
    }
}
