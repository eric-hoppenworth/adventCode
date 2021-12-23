import data from './input.ts'
import testData from './test.ts'


type Pawn = {
    position: number;
    score: number;
}

type Game = {
    players: [Pawn, Pawn]
    nextValue: number
    totalRounds: number
    count: number
}
const dieResults: { value: number; count: number }[] = [
    {
        value: 3,
        count: 1,
    },
    {
        value: 4,
        count: 3,
    },
    {
        value: 5,
        count: 6,
    },
    {
        value: 6,
        count: 7,
    },
    {
        value: 7,
        count: 6,
    },
    {
        value: 8,
        count: 3,
    },
    {
        value: 9,
        count: 1,
    },
]

// I need to optimze the number of universes similar to one of the other puzzles

const parseInput = (input: string): Game => {
    const lines = input.split('\n')
    return {
        players: lines.map((line) => {
            return {
                position: parseInt(line[line.length - 1], 10),
                score: 0
            }
        }) as [Pawn, Pawn],
        nextValue: 6 , // it is a quirk of the deterministic die to roll a "6" the first time
        totalRounds: 0,
        count: 1,
    }
}

const doTurnOne = (game: Game): Game => {
    const turn = game.totalRounds % 2
    const player = game.players[turn]
    player.position = (player.position + game.nextValue) % 10
    if (!player.position) {
        player.position = 10
    }
    player.score += game.players[turn].position

    game.nextValue = game.nextValue - 1
    if (game.nextValue < 0) {
        game.nextValue = 9
    }
    game.totalRounds++
    return game
}

const partOne = (game: Game): number => {
    while(game.players[0].score < 1000 && game.players[1].score < 1000) {
        game = doTurnOne(game)
    }
    return Math.min(...game.players.map(p => p.score)) * (game.totalRounds * 3)
}

const doTurn = (game: Game): Game[] => {
    // console.log(dieResults)
    return dieResults.map((dieResult): Game => {
        const myGame = {
            totalRounds: game.totalRounds,
            nextValue: dieResult.value,
            players: [{
                position: game.players[0].position,
                score: game.players[0].score,
            }, {
                position: game.players[1].position,
                score: game.players[1].score,
            }] as [Pawn, Pawn],
            count: dieResult.count * game.count
        }
        return doTurnOne(myGame)
    })
}

const reduceGames = (games: Game[]): Game[] => {
    const newGames: Game[] = []
    for (const game of games) {
        const similarGame = newGames.find(a => compareGames(a, game))
        if (similarGame) {
            similarGame.count += game.count
        } else {
            newGames.push(game)
        }
    }
    return newGames
}

const compareGames = (a: Game, b: Game): boolean => {
    return a.totalRounds === b.totalRounds &&
        a.players[0].score === b.players[0].score && a.players[0].position === b.players[0].position &&
        a.players[1].score === b.players[1].score && a.players[1].position === b.players[1].position
}

const partTwo = (game: Game): number => {
    let games = doTurn(game)
    // let maxScore = 0
    let player1Wins = 0
    let player2Wins = 0
    while(games.length) {
        games = [...games.map(game => doTurn(game)).flat()]
        games = reduceGames(games)
        games = games.filter((game: Game) => {
            if (game.players[0].score >= 21) {
                player1Wins += game.count
                return false
            }
            if (game.players[1].score >= 21) {
                player2Wins += game.count
                return false
            }
            return true
        })
    }
    return Math.max(player1Wins, player2Wins)
}


// console.log(partOne(parseInput(data)))
console.log(partTwo(parseInput(data)))