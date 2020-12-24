const fs = require('fs')
function flip(image) {
    return [...image].reverse()
}
function rotate(image) {
    let newImage = []
    for (let y = 0; y < image.length; y++) {
        newImage.push([])
    }
    for (let y = 0; y < image.length; y++) {
        for (let x = image[0].length - 1; x >= 0; x--) {
            let row = image.length - x - 1
            newImage[row].push(image[y][x])
        }
    }
    return newImage.map(item => item.join(''))
}

function findSides(image) {
    return {
        top: parseInt(image[0].replace(/\./g, '0').replace(/#/g, '1'), 2),
        bottom: parseInt(image[9].replace(/\./g, '0').replace(/#/g, '1'), 2),
        left: parseInt(image.map(item => item[0]).join('').replace(/\./g, '0').replace(/#/g, '1'), 2),
        right: parseInt(image.map(item => item[9]).join('').replace(/\./g, '0').replace(/#/g, '1'), 2),
    }
}
fs.readFile('./puzzle.txt', 'utf8', function(err, data) {
    data = data.split(require('os').EOL+require('os').EOL).map(item => {
        let [first, ...board] = item.split(require('os').EOL)
        let id = (item.match(/Tile (\d+):/) || [])[1]
        return {
            id,
            board,
            location: null
        }
    })

    console.log(partOne(data))
    // console.log(partTwo(data))
})
function print(image) {
    return image.join(require('os').EOL)
}

function findMatch(myTile, tileBag) {

    let match = null
    for (let i = 0; i < tileBag.length; i++) {
        let tile = tileBag[i]
        let checkPostion = findSides(myTile.tile.board)[myTile.position]
        // see if any orientation of this tile has a matching top
        for (let rotations = 0; rotations < 4; rotations++) {
            let matchPosition = findSides(tile.board)[positions[myTile.position].match]
            if (matchPosition === checkPostion) {
                return tile
            }
            tile.board = rotate(tile.board)
        }
        tile.board = flip(tile.board)
        for (let rotations = 0; rotations < 4; rotations++) {
            let matchPosition = findSides(tile.board)[positions[myTile.position].match]
            if (matchPosition === checkPostion) {
                return tile
            }
            tile.board = rotate(tile.board)
        }
    }
}
function placeTile(tile, map) {
    if (!map[tile.location.y]) {
        map[tile.location.y] = {}
    }
    map[tile.location.y][tile.location.x] = tile
}
const positions = {
    top: {
        y: 1,
        x: 0,
        match: 'bottom'
    },
    bottom: {
        y: -1,
        x: 0,
        match: 'top'
    },
    left: {
        y: 0,
        x: -1,
        match: 'right'
    },
    right: {
        y: 0,
        x: 1,
        match: 'left'
    }
}

function createMap(tileBag) {
    const map = {}
    const queue = []
    tileBag[0].location = {y:0, x:0}

    let tile = tileBag.shift()
    for (let key in positions) {
        queue.push({
            tile,
            position: key
        })
    }

    while(queue.length) {
        let myTile = queue.shift()
        placeTile(myTile.tile, map)

        let match = findMatch(myTile, tileBag)
        if (match) {
            // remove from bag
            tileBag = tileBag.filter(item => {
                return item.id !== match.id
            })
            // set the postion of the matched tile in the map based on myTile.position
            match.location = {
                x: myTile.tile.location.x + positions[myTile.position].x,
                y: myTile.tile.location.y + positions[myTile.position].y
            }
            placeTile(match, map)
            // add three sides to the queue
            for (key in positions) {
                let alreadyMatched = positions[myTile.position].matched
                if (key !== alreadyMatched) {
                    queue.push({
                        tile: match,
                        position: key
                    })
                }
            }
        } else {
            // this peice is a corner/edge
        }
    }
    return map
}

function partOne(data) {
    const map = createMap(data)
    // find the corners and multiply
    return map
}


function partTwo(data) {
    const map = createMap(data)
    // remove the first and last row/column from each tile
    // condense the boards so that there is a single image to look at
    return map
}
