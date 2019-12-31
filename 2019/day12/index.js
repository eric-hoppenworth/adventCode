const fs = require("fs");
function Moon (position) {
    this.position = position;
    this.velocity = {
        x: 0,
        y: 0,
        z: 0
    };
    this.same = {
        x: 0,
        y: 0,
        z: 0
    };
    this.initalPosition = {...position};
}
Moon.prototype.applyGravity = function(moons) {
    // loop over the list of moons
    // check that moons positions against my own
    //
    let acceleration = {
        x: 0,
        y: 0,
        z: 0
    };
    moons.forEach((moon) => {
        for (key in acceleration) {
            acceleration[key] += this.position[key] === moon.position[key] ? 0 : this.position[key] > moon.position[key] ? -1 : 1
        }
    });
    this.velocity = addVectors(this.velocity, acceleration);
}
Moon.prototype.applyVelocity = function() {
    this.position = addVectors(this.position, this.velocity);
}
Moon.prototype.energy = function() {
    let potential = 0;
    for (key in this.position) {
        potential += Math.abs(this.position[key]);
    }

    let kinetic = 0;
    for (key in this.velocity) {
        kinetic += Math.abs(this.velocity[key]);
    }
    return potential*kinetic;
}
Moon.prototype.compare = function(i) {
    let result = true;
    for (key in this.position) {
        if (this.same[key] === 0) {
            if (this.initalPosition[key] === this.position[key] && 0 === this.velocity[key]) {
                this.same[key] = i;
            } else {
                result = false;
            }
        }
    }

    return result;
}
function addVectors(v,u) {
    return {
        x : v.x + u.x,
        y : v.y + u.y,
        z : v.z + u.z
    };
}
fs.readFile("./puzzle.txt","utf8",function(err,data){
    let moons = data.split(require('os').EOL).map(a => {
        let matches = a.match(/x=([\d-]{1,}).{0,}y=([\d-]{0,}).{0,}z=([\d-]{0,})/);
        return new Moon({
            x: parseInt(matches[1]),
            y: parseInt(matches[2]),
            z: parseInt(matches[3]),
        });
    });
    let sameUniverse = false;
    let i = 0;
    while (!sameUniverse) {
        i++;;
        moons.forEach(function(moon){
            moon.applyGravity(moons);
        });
        moons.forEach(function(moon){
            moon.applyVelocity();
        });
        moons.forEach((moon)=>{
            sameUniverse = moon.compare(i);
        });
    }

    console.log(i);
    console.log(moons);
    console.log(moons.map(moon=>moon.energy()).reduce((a,b)=>a+b));
    let xSteps = 286332;
    let ySteps = 96236;
    let zSteps = 193052;

    // LCM...
    // lets say 60 and 26
    // 60 = 2*2*3*5
    // 26 = 2*13
    // LCM = 2*2*3*5*13 = 780
    // GCF = 2

    let LCM = 332477126821644;
    console.log(LCM);
});

