const fs = require('fs')
fs.readFile('./puzzle.txt', 'utf8', function(err, data) {
    data = data.split(require('os').EOL).map(item => parseInt(item))
    const target = 2020
    var t0 = new Date().getTime()
    // console.log(partOne(data, target))
    console.log(partTwo(data, target))
    var t1 = new Date().getTime()
    console.log(t1-t0);
})

function createGroups(data, target) {
    let half = target/2
    const groups = {
        'LESS' : [],
        'MORE' : []
    };
    data.forEach(item => {
        if (item < half) {
            groups['LESS'].push(item)
        } else {
            groups['MORE'].push(item)
        }
    })
    return groups
}

function findPair(small, large, target) {
    for (let i = 0; i < small.length; i++) {
        let item = small[i]
        const newTarget = target - item
        if (large.includes(newTarget)) {
            return [item, newTarget]
        }
    }
    return [0,0];
}
function partOne(data, target) {
    const groups = createGroups(data, target)
    const pair = groups['LESS'].length < groups['MORE'].length ?
        findPair(groups['LESS'], groups['MORE'], target) :
        findPair(groups['MORE'], groups['LESS'], target)
    return pair[0] * pair[1];
}
function partTwo(data, target) {
    while (data.length) {
        const first = data.pop();
        const newTarget = target - first;
        const pairProduct = partOne(data, newTarget)
        if (pairProduct > 0) {
            return first * pairProduct;
        }
    }
}