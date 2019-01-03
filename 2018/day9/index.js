// const fs = require('fs');
let playerCount = 462;
let lastMarble = 7193800; //part two number is too big to process!  I think I need to use maths
//apparently, the native splice method i bottlenecking me (I guess it is really slow to remove items from an array)
//possibly use a deque (double-ended queue) package that allows me to remove at index.
//71938 //7193800

var circle = [0];
var currentMarble = 0;
function MarbleCircle(playerCount) {
    this.marbles = [0];
    this.currentMarble = 0;
    this.players = [];
    for (let i = 0; i < playerCount; i++) {
        this.players.push(new Player());
    }
}
MarbleCircle.prototype.totalScore = function() {
    let total = 0;
    this.players.forEach(function(player){
        total += player.score;
    });
    return total;
}
MarbleCircle.prototype.highScore = function() {
    let highScore = 0;
    this.players.forEach(function(player){
        if (player.score > highScore) {
            highScore = player.score;
        }
    });
    return highScore
}

function Player() {
    this.score = 0;
}
Player.prototype.playMarble = function(circle, value) {
    if (value % 23) {
        circle.currentMarble++
        if (circle.currentMarble >= circle.marbles.length) {
            circle.currentMarble = 0; //if it goes over then end, go back to the start (safe because it only goes up by 1)
        }
        circle.currentMarble++
        circle.marbles.splice(circle.currentMarble, 0, value);

    } else {
        //score this marble and the marble at currentIndex -7
        this.score += value;
        circle.currentMarble -= 7;
        circle.currentMarble = circle.currentMarble < 0 ? circle.currentMarble + circle.marbles.length : circle.currentMarble; //redetermine the index
        let removed = circle.marbles.splice(circle.currentMarble,1)[0];
        this.score += removed;
        circle.currentMarble %= circle.marbles.length;
        // console.log(circle.totalScore());
    }
}
const myCircle = new MarbleCircle(playerCount);

for (let i = 1; i <= lastMarble ; i++) {
    let playerIndex = (i - 1) % myCircle.players.length;
    myCircle.players[playerIndex].playMarble(myCircle, i);
}

console.log(myCircle.highScore());
// console.log(myCircle.totalScore());
// fs.writeFileSync("./circle.json",JSON.stringify(myCircle));