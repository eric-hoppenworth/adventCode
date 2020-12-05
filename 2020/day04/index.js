const fs = require('fs')
const validation = {
    byr : value => value >= '1920' && value <= '2002',
    iyr : value => value >= '2010' && value <= '2020',
    eyr : value => value >= '2020' && value <= '2030',
    hgt : function (value) {
        const match = value.match(/^([\d]{2,3})(in|cm)$/)
        if (!match) {
            return false
        }
        switch (match[2]) {
            case 'cm':
                return match[1] >= 150 && match[1] <= 193
            case 'in':
                return match[1] >= 59 && match[1] <= 76
            default:
                return false
        }
    },
    hcl : value => !!value.match(/^#[\da-f]{6}$/),
    ecl : value => !!value.match(/^(amb|blu|brn|gry|grn|hzl|oth)$/),
    pid : value => !!value.match(/^[\d]{9}$/)

}
fs.readFile('./puzzle.txt', 'utf8', function(err, data) {
    let regex = new RegExp(require('os').EOL,'mgi')
    data = data
        .split(require('os').EOL + require('os').EOL)
        .map(item => {
            const obj = {};
            item.replace(regex, ' ').split(' ').forEach(property => {
                const [key, value] = property.split(':', 2)
                obj[key] = value
            })
            return obj
        })
    // console.log(partOne(data));
    console.log(partTwo(data));
});

function partOne(data) {
    return data.filter((passport) => {
        for (let key in validation) {
            if (!passport[key]) {
                return false
            }
        }
        return true
    }).length
}

function partTwo(data) {
    return data.filter((passport) => {
        for (let key in validation) {
            if (!passport[key]) {
                return false
            }
            if (!validation[key](passport[key])) {
                return false
            }
        }
        return true
    }).length
}

