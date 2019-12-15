const fs = require("fs");
function IntComputer(list, inputs = []) {
    this.list = [...list];
    this.inputs = [...inputs];
    this.outputs = [];
    this.position = 0;
    this.codes = {
        '01' : {
            paramCount : 3,
            compute: (a,b) => a + b
        },
        '02' : {
            paramCount : 3,
            compute: (a,b) => a * b
        },
        '03' : {
            paramCount : 1
        },
        '04' : {
            paramCount : 1
        },
        '05' : {
            paramCount : 2,
            compute: (a) => a !== 0
        },
        '06' : {
            paramCount : 2,
            compute: (a) => a === 0
        },
        '07' : {
            paramCount : 3,
            compute : (a,b) => (a < b) ? 1 : 0
        },
        '08' : {
            paramCount : 3,
            compute : (a,b) => (a === b) ? 1 : 0
        },
        '99' : {
            paramCount : 0
        }
    }
}
IntComputer.prototype.interpret = function(opcode) {
    let string = opcode.toString();
    const initialLength = string.length
    for (let i = initialLength; i < 5 ; i++) {
        string = '0' + string;
    }
    return {
        code : string.substring(3),
        paramModes : string.substring(0,3).split(''), // this array is in 'reverse' order, so that means I can pop
        ...this.codes[string.substring(3)]
    };
}
IntComputer.prototype.handleOpcode = function() {
    const instruction = this.interpret(this.list[this.position]);
    // do what the code tells us to do
    // console.log(code);
    let value;
    switch (instruction.code) {
        case "01":
        case "02":
        case "07":
        case "08":
            let a = this.list[++this.position];
            if (instruction.paramModes.pop() === "0") {
                a = this.list[a];
            }

            let b = this.list[++this.position];
            if (instruction.paramModes.pop() === "0") {
                b = this.list[b];
            }

            value = instruction.compute(a, b);
            if (instruction.paramModes.pop() === "0") {
                this.list[this.list[++this.position]] = value
            } else {
                this.list[++this.position] = value; // ?
            }
            this.position++;
            break;
        case "03":
            // input
            if (instruction.paramModes.pop() === "0") {
                this.list[this.list[++this.position]] = this.inputs.shift();
            } else {
                this.list[++this.position] = this.inputs.shift();
            }
            this.position++;
            break;
        case "04":
            // output to console
            if (instruction.paramModes.pop() === "0") {
                value = this.list[this.list[++this.position]];
            } else {
                value = this.list[++this.position];
            }
            this.outputs.push(value);
            this.position++;
            return;
            break;
        case "05":
        case "06":
            value = this.list[++this.position];
            if (instruction.paramModes.pop() === "0") {
                value = this.list[value];
            }
            if (instruction.compute(value)) {
                this.position = this.list[++this.position];
                if (instruction.paramModes.pop() === "0") {
                    this.position = this.list[this.position];
                }
            } else {
                this.position += 2;
            }
            break;

        case "99":
            // exit
            return 1;
        default:
            console.log(this);
            console.log(this.position);
            console.log(instruction.code);
            return 1;
    }
    return this.handleOpcode();
}
const permutator = (inputArr) => {
    let results = [];
    const permute = (availableItems, currentPerm = []) => {
        if (availableItems.length === 0) {
            results.push(currentPerm); // adds a new item to the results set once there are no more elements in arr
            return currentPerm;
        } else {
            // as long as there are elements in arr, loop over it
            for (let i = 0; i < availableItems.length; i++) {
                let leftovers = [...availableItems]; // make a full copy of the array
                let next = leftovers.splice(i, 1); // takes the 'nth' element out of the copy
                permute(leftovers, currentPerm.concat(next));
            }
        }
    }
    permute(inputArr);
    return results;
}
fs.readFile("./puzzle.txt","utf8",function(err,data){
    // console.log(partOne(data));
    console.log(partTwo(data));
});

function partOne (data) {
    const commands = data.split(',').map((a) => parseInt(a,10));

    let phaseSettings = [0,1,2,3,4];
    let permutations = permutator(phaseSettings);
    let outputs = permutations.map(function(settingList){
        let previousOutput = 0;
        settingList.forEach(function(setting){
            let computer = new IntComputer(commands, [setting, previousOutput]);
            computer.handleOpcode();
            previousOutput = computer.outputs[0];
        });
        return previousOutput;
    });
    let max = 0;
    outputs.forEach(function(output){
        if (output > max) {
            max = output;
        }
    });
    return max;
}

function partTwo(data) {
    const commands = data.split(',').map((a) => parseInt(a,10));
    let phaseSettings = [5,6,7,8,9];
    let permutations = permutator(phaseSettings);
    let outputs = [];

    permutations.forEach(function(permutation){
        let computers = permutation.map(function(setting){
            return new IntComputer(commands, [setting]);
        });
        // first computer needs a 0 as it's second input
        let previousOutput = 0;
        for (let i = 0; i < computers.length; i++) {
            let computer = computers[i];
            computer.inputs.push(previousOutput);
            computer.handleOpcode();
            let nextOutput = computer.outputs.pop();
            if (nextOutput === undefined) {
                // done!
                outputs.push(previousOutput);
                i = computers.length;
            } else {
                previousOutput = nextOutput;
                if (i == computers.length - 1) {
                    i = -1;
                }
            }
        }
    });

    let max = 0;
    outputs.forEach(function(output){
        if (output > max) {
            max = output;
        }
    });
    return max;
}