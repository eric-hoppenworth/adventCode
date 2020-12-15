const fs = require('fs')

fs.readFile('./puzzle.txt', 'utf8', function(err, data) {
    data = data
        .split(require('os').EOL)
    // console.log(partOne(data))
    console.log(partTwo(data))
})
function sumMemory(mem) {
    let total = 0
    for (let key in mem) {
        total += mem[key]
    }
    return total
}

function partOne(data) {
    function applyMask(mask, number) {
        number = number.toString(2).padStart(36,'0')
        let firstMask = mask.replace(/1/g,'0').replace(/X/g,'1')
        let secondMask = mask.replace(/X/g, '0')
        let halves = [{
            number: number.slice(0,18),
            firstMask: firstMask.slice(0,18),
            secondMask: secondMask.slice(0,18)
        },{
            number: number.slice(18),
            firstMask: firstMask.slice(18),
            secondMask: secondMask.slice(18)
        }]
        halves.forEach(item => {
            item.result = (parseInt(item.number,2) & parseInt(item.firstMask,2)) | parseInt(item.secondMask, 2)
            item.resultBin = item.result.toString(2).padStart(18, '0')
        })
        return halves[0].result*Math.pow(2,18)+halves[1].result
    }
    let mask = null
    let mem = {}
    let maskRegex = new RegExp(/^mask = (.*)$/)
    let memRegex = new RegExp(/^mem\[(\d+)\] = (.*)$/)
    data.forEach((item, i) => {
        let results = item.match(maskRegex)
        if (results) {
            mask = results[1]
        } else {
            results = item.match(memRegex)
            if (results) {
                mem[results[1]] = applyMask(mask, parseInt(results[2],10))
            }
        }
    })
    return sumMemory(mem)
}

function partTwo(data) {
    function applyMask(mask, number) {
        number = number.toString(2).padStart(36,'0')
        let adjustedMask = []
        let floatCount = 0
        let results = []
        for (let i = 0; i < mask.length; i++) {
            if (mask[i] === '1') {
                adjustedMask[i] = '1'
            } else if (mask[i] === '0') {
                adjustedMask[i] = number[i]
            } else if (mask[i] === 'X') {
                adjustedMask[i] = 'X'
                floatCount++
            }
        }
        const max = Math.pow(2, floatCount)
        for (let i = 0; i < max; i++) {
            let binary = i.toString(2).padStart(floatCount, '0')
            // now what i need to do is replace each X with the corresponding 1 or 0 from this string
            let final = adjustedMask.join('')
            for(let j = 0; j < floatCount; j++) {
                final = final.replace('X', binary[j])
            }
            results.push(final)
        }
        return results
    }
    let mask = null
    let mem = {}
    let maskRegex = new RegExp(/^mask = (.*)$/)
    let memRegex = new RegExp(/^mem\[(\d+)\] = (.*)$/)
    data.forEach((item, i) => {
        let results = item.match(maskRegex)
        if (results) {
            mask = results[1]
        } else {
            results = item.match(memRegex)
            if (results) {
                let addresses = applyMask(mask, parseInt(results[1],10))
                addresses.forEach(address => {
                    mem[address] = parseInt(results[2],10)
                })
            }
        }
    })

    return sumMemory(mem)
}
