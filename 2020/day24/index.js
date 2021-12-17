const fs = require('fs')

const moves = {
    'se': {
        x: 1,
        y: 1
    },
    'ne': {
        x: 1,
        y: -1
    },
    'sw': {
        x: -1,
        y: 1
    },
    'nw': {
        x: -1,
        y: -1
    },
    'e': {
        x: 2,
        y: 0
    },
    'w': {
        x: -2,
        y: 0
    }
}
fs.readFile('./puzzle.txt', 'utf8', function(err, data) {
    data = data.split(require('os').EOL).map(item => {
        const steps = [];
        let remainder = item;
        while(remainder.length) {
            let length = 1
            if (remainder[0] === 'n' || remainder[0] === 's') {
                length = 2
            }
            steps.push(remainder.slice(0,length))
            remainder = remainder.slice(length)
        }
        return steps
    })
    console.log(partOne(data))
    // console.log(partTwo(data))
})

function partOne(data) {

    let positions = data.map((item) => {
        return item.reduce((carry, step) => {
            return {
                x: carry.x + moves[step].x,
                y: carry.y + moves[step].y
            }
        }, {x:0, y:0});
    })
    let hash = {};
    positions.forEach((item)=>{
        let name = JSON.stringify(item)
        if (!hash[name]) {
            hash[name] = 0
        }
        hash[name]++
    })
    let count = 0
    for (let key in hash) {
        count += hash[key] % 2
    }
    return count;
}
function partTwo(data) {
    return data;
}
