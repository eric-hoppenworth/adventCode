const fs = require("fs");
const IntComputer = require('../intcomputer.js');
function IntRobot (computer) {
    this.computer = computer;
    this.hull = {
        0: {
            0 : 0
        }
    }; // y,x hash
    this.position = {
        x: 0,
        y: 0
    };
    this.direction = "NORTH";
}
const directions = {
    "NORTH" : {
        x: 0,
        y: 1,
        "LEFT": "WEST",
        "RIGHT": "EAST"
    },
    "SOUTH" : {
        x: 0,
        y: -1,
        "LEFT": "EAST",
        "RIGHT": "WEST"
    },
    "EAST" : {
        x: -1,
        y: 0,
        "LEFT": "NORTH",
        "RIGHT": "SOUTH"
    },
    "WEST" : {
        x: 1,
        y: 0,
        "LEFT": "SOUTH",
        "RIGHT": "NORTH"
    }
}
fs.readFile("./puzzle.txt","utf8",function(err,data){
    const commands = data.split(',').map((a)=>parseInt(a,10));
    const robot = new IntRobot(new IntComputer(commands,[1]));

    while (true) {
        robot.computer.handleOpcode();
        let color = robot.computer.outputs.shift();
        robot.computer.handleOpcode();
        let direction = robot.computer.outputs.shift();

        if (color === undefined || direction === undefined) {
            break;
        }
        // paint
        robot.hull[robot.position.y][robot.position.x] = color;
        // turn
        robot.direction = directions[robot.direction][direction ? "RIGHT" : "LEFT"];
        // walk
        robot.position = {
            y: robot.position.y + directions[robot.direction].y,
            x: robot.position.x + directions[robot.direction].x
        };

        // load next input
        if (!robot.hull[robot.position.y]) {
            robot.hull[robot.position.y] = {};
        }
        robot.computer.inputs.push(robot.hull[robot.position.y][robot.position.x] || 0);
    }

    let count = 0;
    let bounds = {
        x: {
            min: Infinity,
            max: -Infinity
        },
        y: {
            min: Infinity,
            max: -Infinity
        }
    };
    for (row in robot.hull) {
        row = parseInt(row);
        if (row < bounds.y.min) {
            bounds.y.min = row;
        }
        if (row > bounds.y.max) {
            bounds.y.max = row;
        }
        for (col in robot.hull[row]) {
            col = parseInt(col);
            if (col < bounds.x.min) {
                bounds.x.min = col;
            }
            if (col > bounds.x.max) {
                bounds.x.max = col;
            }
            count++;
        }
    }
    let printOut = '';
    for (let i = bounds.y.min; i <= bounds.y.max; i++) {
        let row = '';
        for (let j = bounds.x.min; j <= bounds.x.max; j++) {
            row = row + (robot.hull[i][j] ? 'X' : " ");
        }
        row = row + require('os').EOL;
        printOut = printOut+row;
    }
    console.log(printOut);
});

