const fs = require("fs");
const IntComputer = require('../intcomputer.js');


function convertToASCII(string) {
    return string.split('').map(a => a.charCodeAt(0));
}
function partOne(commands){
    const computer = new IntComputer(commands, [],"NON_RECURSIVE");
    while(!computer.handleOpcode()){

    }
    let mapString = computer.outputs.map(a=>String.fromCharCode(a)).join('');
    let mapArray = mapString.split('\n').map((a) => a.split(''));
    console.log(mapString);
    // now I need to go through that array and check for '#'
    // when I find one, I will check around it cardinally, and if those are all also '#'
    // I will need to multiply it's x and y
    const SCAFFOLD = '#';
    const intersections = [];
    mapArray.forEach((row, y)=>{
        row.forEach((space, x)=>{
            if (space === SCAFFOLD) {
                // see if all of its neighbors are also scaffold
                if (!mapArray[y-1] || !mapArray[y+1]) {
                    // continue
                } else {
                    if (
                        mapArray[y][x-1] === SCAFFOLD && mapArray[y][x+1] === SCAFFOLD
                        && mapArray[y-1][x] == SCAFFOLD && mapArray[y+1][x] == SCAFFOLD
                    ) {
                        intersections.push({x,y});
                    }
                }
            }
        });
    });
    console.log(intersections.map((a)=> a.x * a.y).reduce((value, carry) => value + carry, 0));
}
function partTwo(commands){
    const funcs = [
        'A,B,A,B,C,A,B,C,A,C\n',
        'R,6,L,10,R,8\n',
        'R,8,R,12,L,8,L,8\n',
        'L,10,R,6,R,6,L,8\n',
        'n\n'
    ];
    const input = funcs.flatMap(convertToASCII);
    const computer = new IntComputer(commands, input,"NON_RECURSIVE");
    while(!computer.handleOpcode()){

    }
    let mapString = computer.outputs.map(a=>String.fromCharCode(a)).join('');

    console.log(mapString);
    console.log(computer.outputs[computer.outputs.length -1]);
}
fs.readFile("./puzzle.txt","utf8",function(err,data){
    const commands = data.split(',').map(a=>parseInt(a));
    // partOne(commands);
    partTwo(commands);
});