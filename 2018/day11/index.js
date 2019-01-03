function FuelCell(x,y) {
    this.x = x;
    this.y = y;
}
FuelCell.prototype.powerLevel = function(serialNumber = 8868) {
    let rackId = this.x + 10;
    let powerLevel = rackId * this.y;
    powerLevel += serialNumber;
    powerLevel *= rackId;

    let temp = powerLevel % 1000;//remove all digits over 100's place;
    if (temp < 100) {
        powerLevel = 0;
    } else {
        powerLevel = Math.floor(temp/100); //extract teh 100's place;
    }
    return powerLevel - 5; //negatives allowed
}

function FuelGrid(x,y,size) { //a three by three grid starting at teh given coords
    this.x = x;
    this.y = y;
    this.size = size;
}
FuelGrid.prototype.powerLevel = function() {
    let total = 0;
    for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
            total += (new FuelCell(this.x+j, this.y+i)).powerLevel();
        }
    }
    return total;
}



let highest = 0;
let highestGrid = {};
for (let size = 1; size < 100; size++) {
    for (let y = 1; y < 300-size; y++) {
        for (let x = 1; x < 300-size; x++) {
            let myGrid = new FuelGrid(x,y,size);
            let total = myGrid.powerLevel();
            if (total > highest) {
                highest = total;
                highestGrid = myGrid;
            }
        }
    }
}

console.log(highestGrid);

