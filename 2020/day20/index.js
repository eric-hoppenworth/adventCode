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

    // partOne(data).then(data => {
    //     console.log(data)
    // })
    partTwo(data).then(data => {
        console.log(data)
    })

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
    return new Promise(function(resolve, reject){
        fs.readFile('./map.json', 'utf8', function(err, data) {
            if (!err) {
                resolve(JSON.parse(data))
                return
            }
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
            console.log(tileBag)
            fs.writeFile('./map.json', JSON.stringify(map, null, 2), function(err){
                console.log(err)
            })
            resolve(map)
        })
    })
}

function createImage (data) {
    const sortNum = (a,b) => {
        a = parseInt(a, 10)
        b = parseInt(b, 10)
        return a < b ? -1 : a > b ? 1 : 0
    }
    return createMap(data).then(map => {
        return new Promise(function(resolve, reject){
            // fs.readFile('./image.txt', 'utf8', function (err, data) {
                // if (!err) {
                //     return resolve(data.split(require('os').EOL).filter(Boolean))
                // }
                let keys = Object.keys(map).sort(sortNum)
                let tileLength = 0;
                let mapArray = keys.map(index => map[index]).map(row => {
                    let keys = Object.keys(row).sort(sortNum)
                    tileLength = row[0].board[0].length
                    return keys.map(index => row[index].board)
                })
                // condense the boards so that there is a single image to look at
                let mapString = ''
                for (let mapRow = 0; mapRow < mapArray.length; mapRow++) {
                    for (let tileRow = 1; tileRow < tileLength - 1; tileRow++) {
                        for (let mapColumn = 0; mapColumn < mapArray[mapRow].length; mapColumn++) {
                            let string = mapArray[mapRow][mapColumn][tileRow]
                            string = string.slice(1, string.length - 1)
                            mapString = mapString + string
                        }
                        mapString = mapString + require('os').EOL
                    }
                }
                console.log(mapString)
                mapString = mapString.split(require('os').EOL).filter(Boolean)
                mapString = rotate(rotate(flip(mapString)))
                fs.writeFile('./image.txt', mapString.join(require('os').EOL), function(err) {})
                resolve(mapString)
            // })
        })
    })
}

function partOne(data) {
    return createMap(data)
    // TODO: find the corners and multiply
}


function partTwo(data) {
    const seaMonster = [
        /..................#./gm,
        /#....##....##....###/gm,
        /.#..#..#..#..#..#.../gm
    ]
    const locations = []
    // make regex for the monster...the middle row is most special...find that and then try to match the top and bottom rows
    function findMonstersInRow(rows, index) {
        let matches
        let regex = seaMonster[1]
        let monsterCount = 0
        while ((matches = regex.exec(rows[1])) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (matches.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            // The result can be accessed through the `m`-variable.
            matches.forEach((match, groupIndex) => {
                let firstIndex = regex.lastIndex - 20
                let lastIndex = regex.lastIndex
                let top = rows[0].slice(firstIndex, lastIndex)
                let bottom = rows[2].slice(firstIndex, lastIndex)
                if (top.match(seaMonster[0]) && bottom.match(seaMonster[2])) {
                    console.log(top)
                    console.log(rows[1].slice(firstIndex, lastIndex))
                    console.log(bottom)
                    console.log(require('os').EOL)
                    monsterCount++
                    locations.push({row: index, firstIndex})
                }
            })
        }
        return monsterCount
    }
    return createImage(data).then(image => {
        let monsterCount = 0
        for (let i = 0; i < image.length - 2; i++) {
            monsterCount += findMonstersInRow(image.slice(i,i+3), i)
        }
        console.log(locations.length)
        return monsterCount
    })
}
