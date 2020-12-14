const fs = require('fs')

const directions = {
    0: 'E',
    90: 'N',
    180: 'W',
    270: 'S',
}


fs.readFile('./puzzle.txt', 'utf8', function(err, data) {
    data = data
        .split(require('os').EOL)
        .map(item => {
            return {
                direction: item[0],
                count: parseInt(item.slice(1))
            }
        })

    // console.log(partOne(data));
    console.log(partTwo(data));
});

function partOne(data) {
    let player = {
        direction: 0,
        x: 0,
        y: 0
    }
    const steps = {
        'E': function (player, step) {
            return {
                ...player,
                x: player.x + step.count
            }
        },
        'W': function (player, step) {
            return {
                ...player,
                x: player.x - step.count
            }
        },
        'S': function (player, step) {
            return {
                ...player,
                y: player.y - step.count
            }
        },
        'N': function (player, step) {
            return {
                ...player,
                y: player.y + step.count
            }
        },
        'F': function (player, step) {
            return steps[directions[player.direction]](player, {
                count: step.count
            })
        },
        'R': function (player, step) {
            return {
                ...player,
                direction: (player.direction + 360 - step.count) % 360
            }
        },
        'L': function (player, step) {
            return {
                ...player,
                direction: (player.direction + step.count) % 360
            }
        },
    }
    data.forEach((command) => {
        player = steps[command.direction](player, command)
    })
    return Math.abs(player.x) + Math.abs(player.y)
}

function partTwo(data) {
    let player = {
        direction: 0,
        x: 0,
        y: 0
    }
    let waypoint = {
        x: 10,
        y: 1
    }
    const steps = {
        'E': function (player, waypoint, step) {
            return {
                player,
                waypoint: {
                    ...waypoint,
                    x: waypoint.x + step.count
                }
            }
        },
        'W': function (player, waypoint, step) {
            return {
                player,
                waypoint: {
                    ...waypoint,
                    x: waypoint.x - step.count
                }
            }
        },
        'S': function (player, waypoint, step) {
            return {
                player,
                waypoint: {
                    ...waypoint,
                    y: waypoint.y - step.count
                }
            }
        },
        'N': function (player, waypoint, step) {
            return {
                player,
                waypoint: {
                    ...waypoint,
                    y: waypoint.y + step.count
                }
            }
        },
        'F': function (player, waypoint, step) {
            return {
                player: {
                    ...player,
                    x: player.x + (waypoint.x * step.count),
                    y: player.y + (waypoint.y * step.count)
                },
                waypoint
            }
        },
        'R': function (player, waypoint, step) {
            function rotate(position) {
                return {
                    x: position.y,
                    y: position.x * -1
                }
            }
            let newPosition = {...waypoint}
            for (let theta = 0; theta < step.count; theta += 90) {
                newPosition = rotate(newPosition)
            }
            return {
                player,
                waypoint: {
                    ...newPosition
                }
            }
        },
        'L': function (player, waypoint, step) {
            function rotate(position) {
                return {
                    x: position.y * -1,
                    y: position.x
                }
            }
            let newPosition = {...waypoint}
            for (let theta = 0; theta < step.count; theta += 90) {
                newPosition = rotate(newPosition)
            }
            return {
                player,
                waypoint: {
                    ...newPosition
                }
            }
        },
    }
    data.forEach((command) => {
        // const results = steps[command.direction](player, waypoint, command)
        // console.log(results)
        ({player, waypoint} = steps[command.direction](player, waypoint, command))
    })
    console.log(player, waypoint)
    return Math.abs(player.x) + Math.abs(player.y)
}
