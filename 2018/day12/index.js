const fs = require("fs");
const initialState = ".##..#.#..##..##..##...#####.#.....#..#..##.###.#.####......#.......#..###.#.#.##.#.#.###...##.###.#";

function Pot(position, hasPlant) {
    //a pot will know it's own position (will be set by the initial state, but will not change after that.)
    //the position is not necessarily the location in the array.
    //a pot will also know if it contains a plant.
    this.position = position;
    this.hasPlant = hasPlant;
}

function RuleList(rules) {
    //a rule will have an substring that must be matched
    this.rules = [];
    rules.forEach((rule)=>{
        const array = rule.split(" => ");
        this.rules.push({
            input: array[0],
            output: array[1]
        })
    });
    //a rule will have an output that is given if the substring matches
}
//rules need to check for a match and return the substring if matched
RuleList.prototype.check = function (potString) {
    for (let i = 0; i < this.rules.length; i ++) {
        if (this.rules[i].input == potString) {
            return this.rules[i].output;
        }
    }
    return ".";
};

function PotList(initial, leftMostPlant = 1) {
    //will contain an array of pots.  The pot with the lowest postion will be in index 0
    //there will be a unique list for each generation
    this.pots = {};
    let firstPotFoud = false;
    let potsSinceFirst = 0;
    for (let i = 0; i< initial.length; i++) {
        if (initial[i] == "#") {
            this.pots[leftMostPlant + potsSinceFirst] = new Pot(leftMostPlant + potsSinceFirst,true);
            firstPotFoud = true;
        }
        if (firstPotFoud) {
            potsSinceFirst++;
        }
    }
}
//potlist needs to check plant and it's +-2 neighbors against all rules, until one matches.
PotList.prototype.check = function(index) {
    const myPot = this.pots[index];

};
//needs a print-out
PotList.prototype.potListString = function() {
    let result = '';
    for (let key in this.pots) {
        result += (this.pots[key] && this.pots[key].hasPlant) ? "#" : ".";
    }
    return result;
};
PotList.prototype.potString = function(index) {
    //returns a string to be matched against some rule
    let result = '';
    for (let n = -2; n <= 2; n++) {
        if (this.pots[index+n]) {
            result += this.pots[index+n].hasPlant ? "#" : ".";
        } else {
            result += ".";

        }
    }
    return result;
};
PotList.prototype.lowestPosition = function() {
    let lowest = 9999;
    for (let key in this.pots) {
        let value = parseInt(key);
        if (value < lowest) {
            lowest = value;
        }
    }
    return parseInt(lowest);
};
PotList.prototype.highestPosition = function() {
    let highest = 0;
    for (let key in this.pots) {
        let value = parseInt(key);
        if (value > highest) {
            highest = value;
        }
    }
    return parseInt(highest);
};
PotList.prototype.iterate = function(myRules) {
    let nextString = '';
    let leftMostPlant = null;
    let ruleOutput = false;
    for (let i = this.lowestPosition() - 2; i < this.highestPosition() + 2; i++) {
        ruleOutput = myRules.check(this.potString(i));
        if (ruleOutput == "#" && null == leftMostPlant) {
            leftMostPlant = i;
        }
        nextString += ruleOutput;
    }
    return new PotList(nextString, leftMostPlant);
};
PotList.prototype.value = function() {
    let total = 0;
    for (let key in this.pots) {
        if (this.pots[key].hasPlant) {
            total += parseInt(key);
        }
    }
    return total;
};


fs.readFile("./puzzle.txt","utf8",function(err,data){
    const list = data.split(require('os').EOL);
    //read file to create an array of rules
    const myRules = new RuleList(list);
    //use initial state to create the first PotList.
    const myPotList = new PotList(initialState); //0
    let nextList = myPotList.iterate(myRules); //1
    for (let i = 2; i <= 10000; i++) {
        nextList = nextList.iterate(myRules); //1
    }
    console.log(nextList.value());
    //eventually, the fractal reaches equilibrium and just moves to the right, with the plants remaining in the same relative position.  They increase by 78 each iteration...and 10,000 = 782467
});