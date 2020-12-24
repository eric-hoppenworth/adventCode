const fs = require('fs')

fs.readFile('./puzzle.txt', 'utf8', function(err, data) {
    let [rulesString, list] = data.split(require('os').EOL+require('os').EOL)
    let ruleHash = getRules(rulesString.split(require('os').EOL))
    // console.log(partOne(ruleHash, list.split(require('os').EOL)))
    console.log(partTwo(ruleHash, list.split(require('os').EOL)))
})
function partOne(ruleHash, list) {
    return list.reduce((carry, item)=>{
        let regex = new RegExp('^'+ruleHash[0].ruleRegexString+'$')
        return carry + regex.test(item)
    }, 0)
}

function partTwo(ruleHash, list) {
    ruleHash[0].ruleRegexString = ruleHash[8].ruleRegexString + ruleHash[11].ruleRegexString
    return list.reduce((carry, item)=>{
        let regex = new RegExp('^'+ruleHash[0].ruleRegexString+'$')

        if (regex.test(item)) {
            return carry + 1
        } else {
            let rule42 = new RegExp('^'+ruleHash[42].ruleRegexString)
            let rule31 = new RegExp(ruleHash[31].ruleRegexString+'$')
            // it did not match right off, so now I need to see if it fits the adjusted rules...
            // 8 => 42 | 42 8
            // 11 => 42 31 | 42 11 31
            // and therefore...
            // 0 => (42 | 42 8)(42 31 | 42 11 31)
            // simplified...
            // 0 => (a | a ( 'a' anynumber of times))(a b | a ("aXb" anynumber of times, where the number of a and b are equal ) b)

            // ultimately, i should strip off 42's from the from and 31's from the end.
            // if the string is eventually empty, and the number fo 42s is ATLEAST one more than the number of 31s (and both are greater than zero), the message is valid
            // console.log('before:', item)
            let rule42Count = 0
            let rule31Count = 0

            while (rule42.test(item) || rule31.test(item)) {
                if (rule31.test(item)) {
                    item = item.replace(rule31, '')
                    rule31Count++
                }
                if (rule42.test(item)) {
                    item = item.replace(rule42, '')
                    rule42Count++
                }
            }
            if (!item && rule42Count && rule31Count && (rule42Count >= rule31Count + 1)) {
                return carry + 1
            }
        }
        return carry
    }, 0)
}




function getRules(rules) {
    let ruleRegex = new RegExp(/^(\d+): (.*)$/,)
    let ruleHash = {}
    rules = rules.map(rule => {
        let [string, index, conditions, ...rest] = ruleRegex.exec(rule) || []
        let ruleObj = {
            index,
            ruleRegexString: null,
            conditionIndexes: [],
            altIndexes: []
        }
        if (conditions.match(/"[a-z]"/)) {
            ruleObj.ruleRegexString = conditions.replace(/"/g, '')
        } else if (conditions.match(/\|/)) {
            let [left, right] = conditions.split('|').filter(Boolean)
            ruleObj.conditionIndexes = left.split(' ').filter(Boolean)
            ruleObj.altIndexes = right.split(' ').filter(Boolean)
        } else {
            ruleObj.conditionIndexes = conditions.split(' ').filter(Boolean)
        }
        ruleHash[index] = ruleObj
        return ruleObj
    })
    let assignedRule = true
    while(assignedRule) {
        assignedRule = false
        const getRule = (index, rule) => {
            let conditionRule = ruleHash[index]
            if (conditionRule.ruleRegexString) {
                return conditionRule.ruleRegexString
            } else {
                return null
            }
        }
        rules.forEach(rule => {
            if (rule.ruleRegexString) {
                return
            }
            let strings = rule.conditionIndexes.map((index) => getRule(index, rule)).filter(Boolean)
            let altStrings = rule.altIndexes.map((index) => getRule(index, rule)).filter(Boolean)
            if (strings.length === rule.conditionIndexes.length && altStrings.length === rule.altIndexes.length) {


                rule.ruleRegexString = '('+strings.join('')
                if (altStrings.length) {
                    rule.ruleRegexString = rule.ruleRegexString + '|' + altStrings.join('')
                }
                rule.ruleRegexString = rule.ruleRegexString + ')'
                assignedRule = true
                // creates a rule in the form...
                // (xy) or (xx|yy)
                // eventually, these compound to something like...
                // ((aa|bb)(ab|ba)|(bb|ba)(aa|bb))
                //     ^x     ^y  |   ^y     ^x
            }
        })
    }

    return ruleHash
}