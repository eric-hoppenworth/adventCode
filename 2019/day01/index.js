const fs = require("fs");
const FuelCounter = function (list) {
    this.list = list;
};
FuelCounter.prototype.measureOneFuel = function(carry = 0, item) {
    return carry + Math.floor(item/3) - 2;
};
FuelCounter.prototype.measureAllFuel = function() {
    return this.list.reduce(this.measureOneFuel,0);
};
FuelCounter.prototype.measureFuelForFuelToo = function () {
    let total = 0;
    while (this.list.length) {
        const fuel = this.measureOneFuel(0, this.list.pop());
        if (fuel >= 0) {
            this.list.push(fuel);
            total += fuel;
        }
    }
    return total;
};

fs.readFile("./puzzle.txt","utf8",function(err,data){
    const array = data.split(require('os').EOL);
    const fuelCounter = new FuelCounter(array);
    // part 1
    console.log(fuelCounter.measureAllFuel());
    // part 2
    console.log(fuelCounter.measureFuelForFuelToo());
});