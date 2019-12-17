const fs = require("fs");
function reduce(numerator,denominator){
    if (numerator === 0 && denominator === 0) {
        return {
            y: 0,
            x: 0
        };
    }
    var gcd = function gcd(a,b){
        return b ? gcd(b, a%b) : a;
    };
    gcd = gcd(numerator,denominator);
    return {
        y: numerator/gcd,
        x: denominator/gcd
    };
}
function Asteroid(location) {
    this.location = location;
    this.slopes = {};
    this.detectable = 0;
}
Asteroid.prototype.compare = function (asteroid) {
    // what do I do here?
    // i need to send back two data points:
    // slope (as a reduced x/y pair)
    let slope = {
        x: asteroid.location.x - this.location.x,
        y: asteroid.location.y - this.location.y
    };
    let reducedSlope = reduce(Math.abs(slope.y), Math.abs(slope.x));
    let theta = Math.atan2((slope.y < 0 ? -1 : 1)*reducedSlope.y, (slope.x < 0 ? -1 : 1)*reducedSlope.x);
    theta = theta < -Math.PI/2 ? theta + 2*Math.PI : theta; // -π/2 is up in this case
    if (!this.slopes[theta.toString()]) {
        this.slopes[theta.toString()] = [];
    }
    this.slopes[theta].push({
        theta: theta,
        distance: Math.hypot(slope.y, slope.x),
        otherAsteroid: asteroid
    });
};
fs.readFile("./puzzle.txt","utf8",function(err,data){
    let map = data.split(require('os').EOL).map(row=> row.split(''));
    const asteroids = [];
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            if (map[row][col] === "#" || map[row][col] === "X") {
                let asteroid = new Asteroid({
                    x: col,
                    y: row
                });
                asteroids.push(asteroid);
            }
        }
    }
    asteroids.forEach(function(mainAsteroid){
        asteroids.forEach(function(otherAsteroid){
            if (mainAsteroid !== otherAsteroid) {
                mainAsteroid.compare(otherAsteroid);
            }
        });
        let count = 0;
        for (key in mainAsteroid.slopes) {
            count++;
        }
        mainAsteroid.detectable = count;
    });

    let detectCount = 0;
    let myAsteroid = null;
    asteroids.forEach(function(ast){
        if (ast.detectable > detectCount) {
            detectCount = ast.detectable;
            myAsteroid = ast;
        }
    });
    console.log(myAsteroid);

    let angles = [];
    for (theta in myAsteroid.slopes) {
        angles.push(parseFloat(theta));
    }
    angles = angles.sort((a,b) => a>b ? 1 : -1);
    console.log(myAsteroid.slopes[angles[199]][0]);
    // ^ got a little lazy here, but it is fine
});

