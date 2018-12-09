const fs = require("fs");

function Rectangle(string) {

    let front = string.split(" @ ");
    let middle = front[1].split(": ");
    let end = middle[1];
    middle = middle[0];
    front = front[0];

    this.id = front.replace("#","");
    this.x = parseInt(middle.split(",")[0],10);
    this.y = parseInt(middle.split(",")[1],10);
    this.width = parseInt(end.split("x")[0],10);
    this.height = parseInt(end.split("x")[1],10);
    this.isOverlapped = false;
}
const board = {
    0: {

    }
};
fs.readFile("./puzzle.txt","utf8",function(err,data){
    const array = data.split(require('os').EOL);
    const rectangles = [];
    array.forEach(function(claim){
        const myRect = new Rectangle(claim);
        rectangles.push(myRect);

        for (let y = 0; y < myRect.height; y++) {
            if (!board[myRect.y + y]) {
                board[myRect.y + y] = {};
            }
            for (let x = 0; x < myRect.width; x++) {
                if (!board[myRect.y + y][myRect.x + x]) {
                    board[myRect.y + y][myRect.x + x] = [];
                }
                board[myRect.y + y][myRect.x + x].push(myRect);

                if (board[myRect.y + y][myRect.x + x].length > 1) {
                    for (let n = 0; n < board[myRect.y + y][myRect.x + x].length; n++) {
                        board[myRect.y + y][myRect.x + x][n].isOverlapped = true;
                    }
                }
            }
        }
    });
    // console.log(board);
    let count = 0;
    for (row in board) {
        for (col in board[row]) {
            if (board[row][col].length > 1) {
                count++;
            }
        }
    }
    rectangles.forEach(function(elem){
        if (!elem.isOverlapped) {
            console.log(elem);
        }
    });
    console.log(count);
});