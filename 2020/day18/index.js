const fs = require('fs')

fs.readFile('./puzzle.txt', 'utf8', function(err, data) {
    data = data.split(require('os').EOL)
    // console.log(partOne(data))
    console.log(partTwo(data))
})
function evaluateGroup(group) {
    group = group.replace(/[\(\)]/g, '')
    let mathRegex = new RegExp(/([\d]+) ([\+\*]) ([\d]+)(.*)/)
    let [string, left, opp, right, next, ...rest] = mathRegex.exec(group)
    let number = null
    if (opp === '+') {
        number = parseInt(left, 10) + parseInt(right, 10)
    } else {
        number = parseInt(left, 10) * parseInt(right, 10)
    }
    if (next) {
        // do this again?
        return evaluateGroup(number + next)
    } else {
        return number
    }
    group = number + next
}
function evaluateGroup2(group) {
    group = group.replace(/[\(\)]/g, '')
    let addRegex = new RegExp(/(.* |^)([\d]+) ([\+]) ([\d]+)(.*)/)
    let multRegex = new RegExp(/(.* |^)([\d]+) ([\*]) ([\d]+)(.*)/)
    let matches = addRegex.exec(group)
    let number = null
    if (matches) {
        let [string, start, left, opp, right, next, ...rest] = matches
        number = parseInt(left, 10) + parseInt(right, 10)
        if (next || start) {
            return evaluateGroup2(start + number + next)
        } else {
            return number
        }
    }
    matches = multRegex.exec(group)
    if (matches) {
        let [string, start, left, opp, right, next, ...rest] = matches
        number = parseInt(left, 10) * parseInt(right, 10)
        if (next || start) {
            return evaluateGroup2(start + number + next)
        } else {
            return number
        }
    }
    return group
}
function partOne(data) {
    return data.reduce((carry,equation) => {
        equation = '('+equation+')'
        let groupingRegex = new RegExp(/^(.*)(\([^\)\(]*\))(.*)$/,'g');

        let matches = groupingRegex.exec(equation)
        while(matches) {
            let [string, start, group, end, ...rest] = matches
            group = evaluateGroup(group)
            equation = start + group + end
            groupingRegex.lastIndex = 0
            matches = groupingRegex.exec(equation)
        }
        return carry + parseInt(equation, 10)
    }, 0)
}

function partTwo(data) {
    return data.reduce((carry,equation) => {
        equation = '('+equation+')'
        let groupingRegex = new RegExp(/^(.*)(\([^\)\(]*\))(.*)$/,'g');

        let matches = groupingRegex.exec(equation)
        while(matches) {
            let [string, start, group, end, ...rest] = matches
            group = evaluateGroup2(group)
            equation = start + group + end
            groupingRegex.lastIndex = 0
            matches = groupingRegex.exec(equation)
        }
        return carry + parseInt(equation, 10)
    }, 0)
    return data
}
