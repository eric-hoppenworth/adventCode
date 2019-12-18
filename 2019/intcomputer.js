function IntComputer(list, inputs = [], mode = "RECURSIVE") {
    this.list = [...list];
    this.inputs = [...inputs];
    this.outputs = [];
    this.position = 0;
    this.relativeBase = 0;
    this.mode = mode;
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
        '09' : {
            paramCount : 1
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
    // console.log(string);
    return {
        code : string.substring(3),
        paramModes : string.substring(0,3).split(''), // this array is in 'reverse' order, so that means I can pop
        ...this.codes[string.substring(3)]
    };
}
IntComputer.prototype.handleOpcode = function() {
    const instruction = this.interpret(this.list[this.position] || 0);
    // do what the code tells us to do
    // console.log(code);
    let value;
    let paramMode;
    switch (instruction.code) {
        case "01":
        case "02":
        case "07":
        case "08":
            let a = this.list[++this.position] || 0;
            paramMode = instruction.paramModes.pop();
            if (paramMode !== "1") {
                a = this.list[a + (paramMode == '2' ? this.relativeBase : 0)] || 0;
            }

            let b = this.list[++this.position];
            paramMode = instruction.paramModes.pop();
            if (paramMode !== "1") {
                b = this.list[b + (paramMode == '2' ? this.relativeBase : 0)] || 0;
            }

            value = instruction.compute(a, b);
            paramMode = instruction.paramModes.pop();
            if (paramMode !== "1") {
                this.list[this.list[++this.position] + (paramMode == '2' ? this.relativeBase : 0)] = value
            } else {
                this.list[++this.position] = value;
            }
            this.position++;
            break;
        case "03":
            // input
            paramMode = instruction.paramModes.pop();
            if (paramMode !== "1") {
                this.list[(this.list[++this.position] || 0) + (paramMode == '2' ? this.relativeBase : 0)] = this.inputs.shift();
            } else {
                this.list[++this.position] = this.inputs.shift();
            }
            this.position++;
            break;
        case "04":
            // output to console
            paramMode = instruction.paramModes.pop();
            let c = this.list[++this.position] || 0
            if (paramMode !== "1") {
                value = this.list[c + (paramMode == '2' ? this.relativeBase : 0)] || 0;
            } else {
                value = c;
            }
            this.outputs.push(value);
            this.position++;
            return;
            break;
        case "05":
        case "06":
            value = this.list[++this.position] || 0;
            paramMode = instruction.paramModes.pop();
            if (paramMode !== "1") {
                value = this.list[value + (paramMode == '2' ? this.relativeBase : 0)] || 0;
            }
            if (instruction.compute(value)) {
                this.position = this.list[++this.position] || 0;
                paramMode = instruction.paramModes.pop();
                if (paramMode !== "1") {
                    this.position = this.list[this.position + (paramMode == '2' ? this.relativeBase : 0)] || 0;
                }
            } else {
                this.position += 2;
            }
            break;
        case "09":
            // increase the relative base
            let increaseAmount = this.list[++this.position] || 0;
            paramMode = instruction.paramModes.pop();
            if (paramMode !== "1") {
                increaseAmount = this.list[increaseAmount + (paramMode == '2' ? this.relativeBase : 0)] || 0;
            }
            this.relativeBase += increaseAmount;
            // increase the position
            this.position++;
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
    if (this.mode == "RECURSIVE" ) {
        return this.handleOpcode();
    } else {
        return 0;
    }
}

module.exports = IntComputer;