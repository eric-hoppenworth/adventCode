const fs = require('fs')

fs.readFile('./puzzle.txt', 'utf8', function(err, data) {
    data = data.split(require('os').EOL).map(item => item.replace(')','').split(' (contains ')).map(item => {
        return {
            ingredients: item[0].split(' '),
            allergens: item[1].split(', ')
        }
    })
    // console.log(partOne(data))
    console.log(partTwo(data))
})

function intersection(array1, array2) {
    return array1.filter(value => array2.includes(value));
}

function getOptions(data) {
    const options = {}
    data.forEach(food => {
        food.allergens.forEach(allergen => {
            choices = options[allergen]
            if (!choices) {
                choices = [...food.ingredients]
            } else {
                choices = intersection(choices, food.ingredients)
            }
            options[allergen] = choices
        })
    })
    return options
}

function getAllergens(data) {
    const options = getOptions(data)
    const list = new Set();
    for (let key in options) {
        options[key].forEach(item => {
            list.add(item)
        })
    }
    return list
}

function partOne(data) {
    const allergens = getAllergens(data)
    return data.reduce((carry, food) => {
        return carry + food.ingredients.reduce((carry, item) => allergens.has(item) ? carry : carry + 1, 0)
    }, 0)
}
function partTwo(data) {
    const allergens = getOptions(data)
    const list = []
    for (let key in allergens) {
        list.push({
            name: key,
            options: allergens[key],
            ingredient: null
        })
    }
    const assigned = []
    while(assigned.length < list.length) {
        list.forEach(item => {
            if (item.ingredient) {
                return
            }
            item.options = item.options.filter(ing => !assigned.includes(ing))
            if (item.options.length === 1) {
                item.ingredient = item.options[0]
                assigned.push(item.ingredient)
            }
        })
    }
    list.sort((a, b) => a.name < b.name ? -1 : 1)

    return list.map(item => item.ingredient).join(',')
}
