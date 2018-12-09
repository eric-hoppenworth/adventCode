const fs = require("fs");
function Polymer(string, typeToRemove = null) {
    this.units = [];
    this.removedType = 'none';
    if (typeToRemove) {
        //remove all cases of that letter, both upper and lower
        this.removedType = typeToRemove;
        string = string.replace(new RegExp(typeToRemove,'ig'),'');
    }
    for (let i = 0; i < string.length; i++) {
        this.units.push(new Unit(string[i]));
    }
}
Polymer.prototype.removeUnitAt = function(index) {
    this.units.splice(index, 1);
}
Polymer.prototype.react = function() {
    let didRemove = true;

    while(didRemove) {
        didRemove = false;
        for (let i = 1; i < this.units.length; i++) {
            let previousUnit = this.units[i - 1];
            let myUnit = this.units[i];
            if (myUnit.willReact(previousUnit)) {
                this.removeUnitAt(i) //remove the this item
                this.removeUnitAt(i - 1); //remove the previous item
                didRemove = true;
                break;
            }
        }
    }
}
Polymer.prototype.length = function() {
    return this.units.length;
}
Polymer.prototype.toString = function() {
    return this.units.join('');
}

function Unit(letter) {
    this.type = letter.toLowerCase(); //for easier comparison
    this.polarity = letter.toUpperCase() == letter ? 'up' : 'down';
}
Unit.prototype.hasOppositePolarity = function(unit) {
    return unit.polarity != this.polarity;
};
Unit.prototype.isSameType = function(unit) {
    return unit.type == this.type;
};
Unit.prototype.willReact = function(unit) {
    return this.hasOppositePolarity(unit) && this.isSameType(unit);
};
Unit.prototype.getPolymer = function() {
    return polymer;
}
Unit.prototype.destroy = function(index) {
    this.getPolymer().splice(index,1);
}

//create the array of possible letters
const letters = [];
for (let i = 97; i < 123; i++) {
    letters.push(String.fromCharCode(i));
}

fs.readFile("./puzzle.txt","utf8",function(err,data){
    // console.log(data.length);
    let minLength = 50000;
    letters.forEach(function(letter){
        let myPolymer = new Polymer(data, letter);
        myPolymer.react();
        if (myPolymer.length() < minLength) {
            minLength = myPolymer.length();
        }
    });
    console.log(minLength);
});