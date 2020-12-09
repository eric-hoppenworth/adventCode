const fs = require('fs')
function DataSet(data) {
    this.data = data
    this.accumulator = 0
    this.pointer = 0
}
DataSet.prototype.acc = function (value){
    this.accumulator += value
    this.pointer++
}
DataSet.prototype.nop = function (value){
    this.pointer++
}
DataSet.prototype.jmp = function (value){
    this.pointer += value
}
DataSet.prototype.run = function(mode = 'LOOP'){
    const pointers = new Set();
    let finished = false;
    while(!pointers.has(this.pointer)) {
        pointers.add(this.pointer)
        if (this.pointer > this.data.length || this.pointer < 0) {
            break
        }
        if (this.data.length === this.pointer) {
            finished = true
            break
        }
        this[this.data[this.pointer].action](this.data[this.pointer].value)

    }
    if (mode === 'LOOP') {
        return this.accumulator
    } else {
        if (!finished) {
            return false
        } else {
            return this.accumulator
        }
    }

}
fs.readFile('./puzzle.txt', 'utf8', function(err, data) {
    data = data
        .split(require('os').EOL)
        .map(item => {
            return {
                action: item.slice(0,3),
                value: parseInt(item.slice(3),10)
            }
        })

    // console.log(partOne(data));
    console.log(partTwo(data));
});

function partOne(data) {
    return new DataSet(data).run()
}

function partTwo(data) {
    const dataSets = [];
    data.forEach((item, index)=>{
        if (item.action !== 'acc') {
            dataSets.push(new DataSet([
                ...data.slice(0,index),
                {
                    action: item.action === 'nop' ? 'jmp' : 'nop',
                    value: item.value
                },
                ...data.slice(index + 1)
            ]))
        }
    });
    for (let i = 0; i< dataSets.length; i++) {
        let value = dataSets[i].run('other')
        if (value) {
            return value
        }
    }
    return 'nothing'
}

