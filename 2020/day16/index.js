const fs = require('fs')
function Rule(low1, high1, low2, high2, name) {
    this.name = name
    this.low1 = low1
    this.high1 = high1
    this.low2 = low2
    this.high2 = high2
    this.position = null
    this.possiblePositions = []
}
Rule.prototype.check = function (value) {
    return (value >= this.low1 && value <= this.high1) || (value >= this.low2 && value <= this.high2)
}
Rule.prototype.assignPosition = function (position) {
    this.position = position
    this.possiblePositions = []
}
Rule.prototype.removePostion = function (position) {
    this.possiblePositions = this.possiblePositions.filter(item => item !== position)
}
Rule.prototype.hasOnePosition = function () {
    return this.possiblePositions.length === 1
}

function parse(input) {
    let [temp, tickets] = input.split('nearby tickets:'+require('os').EOL)
    let [rules, myTicket] = temp.split('your ticket:'+require('os').EOL)

    const ruleRegex = new RegExp(/(.*): (\d+)-(\d+) or (\d+)-(\d+)/)
    rules = rules.split(require('os').EOL).filter(item => item).map((item, i) => {
        let [match, name, low1, high1, low2, high2, ...rest] = item.match(ruleRegex) || [];
        if (match) {
            return new Rule(parseInt(low1, 10), parseInt(high1, 10), parseInt(low2, 10), parseInt(high2, 10), name)
        }
    })

    return {
        rules: rules,
        myTicket: myTicket.split(',').map(item => parseInt(item, 10)),
        tickets: tickets.split(require('os').EOL).map(item => item.split(',').map(value => parseInt(value, 10)))
    }
}
fs.readFile('./puzzle.txt', 'utf8', function(err, data) {
    data = parse(data)
    // console.log(partOne(data))
    console.log(partTwo(data))
})

function checkTicket(ticket, rules) {
    return ticket.reduce((carry, value) => {
        let valid = false
        for (let i = 0; i < rules.length; i++) {
            if (rules[i].check(value)) {
                valid = true
                break
            }
        }
        if (!valid) {
            carry.value += value
            carry.valid = false
        }
        return carry
    }, {valid:true, value: 0})
}

function partOne(data) {
    return data.tickets.reduce((carry, ticket) => {
        return carry + checkTicket(ticket, data.rules).value
    }, 0)
}

function partTwo(data) {
    const validTickets = data.tickets.filter((ticket) => {
        return checkTicket(ticket, data.rules).valid
    })
    validTickets.push(data.myTicket)
    data.rules.forEach(rule => {
        for (let i = 0; i < data.myTicket.length; i++) {
            let positionIsValid = validTickets.reduce((carry, ticket) => {
                if (rule.check(ticket[i])) {
                    return carry && true
                } else {
                    return false
                }
            }, true)
            if (positionIsValid) {
                rule.possiblePositions.push(i)
            }
        }
    })

    let hadChange = true
    while(hadChange) {
        hadChange = false
        data.rules.forEach(rule => {
            if (rule.hasOnePosition()) {
                rule.assignPosition(rule.possiblePositions[0])
                removePostionFromAll(rule.position, data.rules)
                hadChange = true
            }
        })
    }

    // now find the final answer
    return data.rules.reduce((carry, rule) => {
        if (rule.name.match(/^departure/)) {
            return carry * data.myTicket[rule.position]
        }
        return carry
    }, 1)

}

function removePostionFromAll(position, rules) {
    for (let name in rules) {
        rules[name].removePostion(position)
    }
}
