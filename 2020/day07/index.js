const fs = require('fs')
const BAG = 'shiny gold'

fs.readFile('./puzzle.txt', 'utf8', function(err, data) {
    const regex = new RegExp(/(\w+ \w+) bags contain (.*)/)
    const childRegex = new RegExp(/(\d+) (\w+ \w+) bag/)
    const hash = {}
    data = data
        .split(require('os').EOL)
        .map(item => {
            const [a, type, children] = item.match(regex);
            return {
                type,
                children: children === 'no other bags.' ? [] : children.split(', ').map(item => {
                    const [a, count, type] = item.match(childRegex) || []
                    if (!a) {
                        return null
                    }
                    return {
                        count: parseInt(count),
                        type,
                    }
                })
            }
        }).forEach(item => {
            hash[item.type] = item
        })
    console.log(partOne(hash));
    console.log(partTwo(hash));
    console.log(partTwoB(hash));
});

function partOne(hash) {
    const containingBags = new Set([BAG]);
    let addedABag = true
    while (addedABag) {
        addedABag = false
        for (let type in hash) {
            const checkBag = hash[type]
            if (containingBags.has(type)) {
                continue
            }
            if (checkBag.children.some(bag => containingBags.has(bag.type))) {
                containingBags.add(checkBag.type);
                addedABag = true
            }
        }
    }
    return containingBags.size - 1
}

function partTwo(hash) {
    function bagCounter (activeBag) {
        let hashBag = hash[activeBag.type]
        if (!hashBag.children.length) {
            return activeBag.count || 1
        }
        return (hashBag.children.reduce((carry, bag) => {
            return carry + bagCounter(bag)
        }, 0) + 1) * (activeBag.count || 1)
    }
    return bagCounter(hash[BAG]) - 1
}

function partTwoB(hash) {
    return (bagCounter = (activeBag, count = 1) => (activeBag.children.reduce((carry, bag) => carry + bagCounter(hash[bag.type], bag.count), 0) + 1) * count)(hash[BAG], 1) - 1
}

