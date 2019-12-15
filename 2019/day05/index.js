const fs = require("fs");

function IntComputer(list, inputs = []) {
    this.list = [...list];
    this.inputs = [...inputs];
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
IntComputer.prototype.handleOpcode = function(position) {
    const instruction = this.interpret(this.list[position]);
    // do what the code tells us to do
    // console.log(code);
    let value;
    switch (instruction.code) {
        case "01":
        case "02":
        case "07":
        case "08":
            let a = this.list[++position];
            if (instruction.paramModes.pop() === "0") {
                a = this.list[a];
            }

            let b = this.list[++position];
            if (instruction.paramModes.pop() === "0") {
                b = this.list[b];
            }

            value = instruction.compute(a, b);
            if (instruction.paramModes.pop() === "0") {
                this.list[this.list[++position]] = value
            } else {
                this.list[++position] = value; // ?
            }
            position++;
            break;
        case "03":
            // input
            if (instruction.paramModes.pop() === "0") {
                this.list[this.list[++position]] = this.inputs.shift();
            } else {
                this.list[++position] = this.inputs.shift();
            }
            position++;
            break;
        case "04":
            // output to console
            if (instruction.paramModes.pop() === "0") {
                value = this.list[this.list[++position]];
            } else {
                value = this.list[++position];
            }
            console.log(value);
            position++;
            break;
        case "05":
        case "06":
            value = this.list[++position];
            if (instruction.paramModes.pop() === "0") {
                value = this.list[value];
            }
            if (instruction.compute(value)) {
                position = this.list[++position];
                if (instruction.paramModes.pop() === "0") {
                    position = this.list[position];
                }
            } else {
                position += 2;
            }
            break;

        case "99":
            // exit
            return 1;
        default:
            console.log(this);
            console.log(position);
            return 1;
    }
    return this.handleOpcode(position);
}

fs.readFile("./puzzle.txt","utf8",function(err,data){

    const array = data.split(',').map((a) => parseInt(a,10));
    const computer = new IntComputer(array,[1]);
    computer.handleOpcode(0);

    // const testArray = "3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99".split(',').map((a) => parseInt(a,10));
    const computer2 = new IntComputer(array,[5]);
    computer2.handleOpcode(0);

});