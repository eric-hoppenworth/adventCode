const fs = require("fs");
const IntComputer = require('../intcomputer.js');
const inquirer = require('inquirer');
inquirer.registerPrompt('autosubmit', require('inquirer-autosubmit-prompt'));

const movesThisGame = [];
const tileMap = {
    '0' : String.fromCharCode(9608),
    '1' : '.',
    '2' : 'X',
    'robot' : '*'
};
function RepairRobot(computer, savedMoves = []) {
    this.map = {
        '0' : {
            '0' : 1
        }
    };
    this.savedMoves = savedMoves;
    this.computer = computer;
    this.directions = {
        'w': {
            value: 1,
            direction: {
                x: 0,
                y: -1
            }
        },
        's': {
            value: 2,
            direction: {
                x: 0,
                y: 1
            }
        },
        'd' : {
            value: 3,
            direction: {
                x: 1,
                y: 0
            }
        },
        'a' : {
            value: 4,
            direction: {
                x: -1,
                y: 0
            }
        }
    };
    this.position = {
        y: 0,
        x: 0
    };
}

RepairRobot.prototype.move = function(lastMove = null) {
    let me = this;
    this.computer.handleOpcode();
    if (lastMove) {
        this.updateMap(lastMove);
    }
    // print the board here
    this.printMap();
    const handleInput = (answers) => {
        if (answers.direction === "l") {
            // on 'l' I want to save and exit
            fs.writeFile('./moveList.json',JSON.stringify(movesThisGame), function(){});
            return;
        }
        movesThisGame.push(answers);
        if (this.directions[answers.direction]) {
            this.computer.inputs.push(this.directions[answers.direction].value);
        }
        me.move(this.directions[answers.direction]);

    }
    if (this.savedMoves.length) {
        let move = this.savedMoves.shift();
        handleInput(move);
    } else {
        inquirer.prompt([{
            message : 'choose a direction',
            name: 'direction',
            type: 'autosubmit',
            autoSubmit: input => input.length === 1
        }]).then(handleInput);
    }
}
RepairRobot.prototype.updateMap = function(lastMove) {
    let newPosition = addVectors(this.position, lastMove.direction);
    let status = this.computer.outputs.shift();

    if (!this.map[newPosition.y]) {
        this.map[newPosition.y] = {};
    }
    this.map[newPosition.y][newPosition.x] = status;

    if (status !== 0) {
        this.position = newPosition;
    }
}
RepairRobot.prototype.printMap = function() {
    //prints the map in a 10 tile 'radius'
    let radius = 15;
    let mapString = '';
    for (let dy = -1*radius; dy <= radius; dy++) {
        let y = this.position.y + dy;
        if (!this.map[y]) {
            this.map[y] = {};
        }
        for (let dx = -1*radius*2; dx <= radius*2; dx++) {
            let x = this.position.x + dx;
            let positionCode = this.map[y][x];
            if (dy===0 && dx===0) {
                positionCode = 'robot';
            }
            mapString = mapString + (tileMap[positionCode] || " ")
        }
        mapString = mapString + require('os').EOL;
    }
    console.log(mapString);
    fs.writeFile('./map.json', JSON.stringify({
        map: this.map,
        position: this.position
    }), function(){

    });
    return mapString;
}
function addVectors(v,u) {
    return {
        x : v.x + u.x,
        y : v.y + u.y
    };
}

function playRobot() {
    fs.readFile("./puzzle.txt","utf8",function(err,data){
        fs.readFile('./moveList.json', 'utf8', function(err, moveList){
            const commands = data.split(',').map(a=>parseInt(a));
            const computer = new IntComputer(commands, [],'RECURSIVE', true);
            const robot = new RepairRobot(computer, JSON.parse(moveList));
            robot.move();
        });
    });
}

function printMap() {
    fs.readFile("./map.json","utf8",function(err,data){
        let map = JSON.parse(data).map;
        let lowestRow = Infinity;
        let highestRow = -Infinity;
        for (row in map) {
            if (parseInt(row) < lowestRow) {
                lowestRow = parseInt(row);
            }
            if (parseInt(row) > highestRow) {
                highestRow = parseInt(row);
            }
        }
        let lowestCol = Infinity;
        let highestCol = -Infinity;
        for (let row = lowestRow; row <= highestRow; row++) {
            if (map[row]) {
                for (col in map[row]) {
                    if (parseInt(col) < lowestCol) {
                        lowestCol = parseInt(col);
                    }
                    if (parseInt(col) > highestCol) {
                        highestCol = parseInt(col);
                    }
                }
            }
        }

        let mapString = '';
        for (let y = lowestRow; y <= highestRow; y++) {
            if (!map[y]) {
                continue;
            }
            for (let x = lowestCol; x <= highestCol; x++) {
                let positionCode = map[y][x];
                if (y===0 && x===0) {
                    positionCode = 'robot';
                }
                mapString = mapString + (tileMap[positionCode] || " ")
            }
            mapString = mapString + require('os').EOL;
        }
        console.log(mapString);
        fs.writeFile('./map.txt',mapString,function(){

        })
    });
}

// playRobot();
// printMap();
