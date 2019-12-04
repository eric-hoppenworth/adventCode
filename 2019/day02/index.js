const fs = require("fs");

function IntComputer(list, noun=12, verb=2) {
    this.step = 4;
    this.list = [...list];
    this.target = 19690720;
    this.noun = noun;
    this.verb = verb;

    this.list[1] = noun;
    this.list[2] = verb;
}
IntComputer.prototype.handleStep = function(position) {
    switch (this.list[position]) {
        case 1:
            this.list[this.list[position+3]] = this.list[this.list[position+2]] + this.list[this.list[position+1]];
            return this.handleStep(position+4);
        case 2:
            this.list[this.list[position+3]] = this.list[this.list[position+2]] * this.list[this.list[position+1]];
            return this.handleStep(position+4);
        case 99:
            return this.list[0];
        default:
            return false;
    }
}
IntComputer.prototype.compute = function () {
    return (100 * this.noun) + this.verb;
};
fs.readFile("./puzzle.txt","utf8",function(err,data){

    const array = data.split(',').map((a) => parseInt(a,10));
    const computer = new IntComputer(array,12,2);
    console.log(computer.handleStep(0));

    for (let i = 0; i <= 99; i++) {
        for (let j = 0; j <= 99; j++) {
            const computer = new IntComputer(array,i,j);
            if (computer.handleStep(0) == computer.target) {
                console.log(computer.compute());
                return 1;
            }
        }
    }

});