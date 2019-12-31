const fs = require("fs");
const IntComputer = require('../intcomputer.js');
const inquirer = require('inquirer');

function printBoard(board, score) {
    // console.log(board);
    const tileMap = {
        0 : " ",
        1 : String.fromCharCode(9608),
        2 : String.fromCharCode(9723),
        3 : "_",
        4 : String.fromCharCode(9675),
    };

    let string = '';
    let blockCount = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] == 2) {
                blockCount++;
            }
            string = string + tileMap[board[i][j]];
        }
        string = string + require('os').EOL;
    }
    console.log(string);
    console.log(score);
    console.log(blockCount);
    newPaddle = false;
    newBall = false;
}
fs.readFile("./puzzle.txt","utf8",function(err,data){
    fs.readFile('./save.txt', "utf8", function (err, saveData) {
        const commands = data.split(',').map(a=>parseInt(a));
        const saveFile = JSON.parse(saveData).slice(0,-5);
        const computer = new IntComputer(commands, saveFile,"NON_RECURSIVE");
        let board = [];
        let score = 0;
        let moves = [...saveFile];

        function runComputer() {
            let running = true;
            while(running) {
                if (computer.nextCommand().code == "03" && computer.inputs.length == 0) {
                    [board, score] = updateBoard(board, score);
                    // console.log("Update Board");
                    // console.log("PRINT");
                    printBoard(board, score);
                    inquirer.prompt([{
                        message : 'choose a direction',
                        name: 'direction'
                    }]).then(function(answers){
                        let directions = {
                            'a': -1,
                            's': 0,
                            'd': 1
                        };
                        computer.inputs.push(directions[answers.direction] || 0);
                        moves.push(directions[answers.direction] || 0);
                        computer.handleOpcode();
                        runComputer();

                    });
                    running = false;
                } else {
                    let res = computer.handleOpcode();
                    if (res) {
                        fs.writeFile('./save.txt', JSON.stringify(moves), function(){

                        });
                        fs.writeFile('./puzzle2.txt', JSON.stringify(computer.list), function(){

                        });
                        console.log(score);
                        console.log(computer.outputs);
                        return;
                    }
                }
            }
        }
        function updateBoard(board,score) {
            while(computer.outputs.length) {
                let x = computer.outputs.shift();
                let y = computer.outputs.shift();
                let value = computer.outputs.shift();
                if (!board[y]) {
                    board[y] = [];
                }
                if (x === -1 && y === 0 ) {
                    score = value;
                }
                board[y][x] = value;
            }
            return [board, score];
        }
        runComputer();
    });
});

