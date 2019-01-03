const fs = require("fs");

function Vector2(x,y) {
    this.x = x;
    this.y = y;
}
Vector2.prototype.add = function(vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
}

function Light(string){
    let regex = /position=< ?(-?\d*),\s*(-?\d*)> velocity=< ?(-?\d*),\s*(-?\d*)>/;
    let array = string.match(regex);
    this.position = new Vector2(parseInt(array[1]),parseInt(array[2]));
    this.velocity = new Vector2(parseInt(array[3]),parseInt(array[4]));
}
Light.prototype.tick = function () {
    this.position.add(this.velocity);
    return this;
};

function NightSky(list) {
    this.lights = [];
    list.forEach((line)=>{
        this.lights.push(new Light(line));
    });
    this.map = null;
}
NightSky.prototype.lowest = function() {
    let lowest = {
        x: 99999,
        y: 99999
    };
    this.lights.forEach((light)=>{
        if (light.position.x < lowest.x) {
            lowest.x = light.position.x;
        }
        if (light.position.y < lowest.y) {
            lowest.y = light.position.y;
        }
    });
    return lowest;
}
NightSky.prototype.highest = function() {
    let highest = {
        x: 0,
        y: 0
    };
    this.lights.forEach((light)=>{
        if (light.position.x > highest.x) {
            highest.x = light.position.x;
        }
        if (light.position.y > highest.y) {
            highest.y = light.position.y;
        }
    });
    return highest;
}
NightSky.prototype.look = function(tick) {
    //print the map
    //put coords on map
    this.lights.forEach((light)=>{
        if (this.map[light.position.y]) {
            this.map[light.position.y][light.position.x] = "#";
        }
    });
    const lowest = this.lowest();
    const highest = this.highest();
    let mapString = '';
    for (let row = lowest.y; row <= highest.y; row++) {
        let myRow = this.map[row];
        let rowString = '';
        for (let col = lowest.x; col <= highest.x; col++) {
            rowString += myRow[col];
        }
        mapString += rowString + require('os').EOL;
    }
    fs.writeFileSync(`./sky/time${tick+1}.txt`, mapString);
    //clear the map
}
NightSky.prototype.tick = function() {
    this.lights = this.lights.map((light)=>{
        return light.tick();
    });
}
NightSky.prototype.drawMap = function() {
    const empty = ".";
    this.map = {};
    const lowest = this.lowest();
    const highest = this.highest();

    for (let row = lowest.y; row <= highest.y; row++) {
        this.map[row] = {};
        for (let col = lowest.x; col <= highest.x; col++) {
            this.map[row][col] = empty;
        }
    }
}

fs.readFile("./puzzle.txt","utf8",function(err,data){
    const list = data.split(require('os').EOL);
    const sky = new NightSky(list);

    // console.log(sky);
    for (let i = 0; i < 10090; i++) {
        sky.tick();
    }
    for (let i = 10090; i < 10110; i++) {
        sky.tick();
        sky.drawMap();
        sky.look(i);
    }


});