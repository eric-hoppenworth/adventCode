const fs = require("fs");

function Coord(string, index) {
    this.x = parseInt(string.split(", ")[0]);
    this.y = parseInt(string.split(", ")[1]);
    this.isFinite = false; //will have to change this after all coords are generated.
    this.area = 0;
    this.name = index < 10 ? "0" + index : "" + index;
}
Coord.prototype.distanceFrom = function(point) {
    return Math.abs(point.x - this.x) + Math.abs(point.y - this.y);
};
//does not work!
// Coord.prototype.setInfinite = function(coordList) {
//     let hasQ1 = false;
//     let hasQ2 = false;
//     let hasQ3 = false;
//     let hasQ4 = false;
//     const me = this;
//     coordList.forEach(function(coord){
//         if (coord.name == me.name) {
//             //this is me, don't check it
//         } else {
//             if (coord.x >= me.x && coord.y <= me.y) {
//                 hasQ1 = true;
//             }
//             if (coord.x <= me.x && coord.y <= me.y) {
//                 hasQ2 = true;
//             }
//             if (coord.x <= me.x && coord.y >= me.y) {
//                 hasQ3 = true;
//             }
//             if (coord.x >= me.x && coord.y >= me.y) {
//                 hasQ4 = true;
//             }
//         }
//     });
//     if (hasQ1 && hasQ2 && hasQ3 && hasQ4) {
//         this.isFinite = true;
//     } else {
//         this.isFinite = false;
//     }
//     return this.isFinite;
// };

fs.readFile("./puzzle.txt","utf8",function(err,data){
    const list = data.split(require('os').EOL);
    //create a list of coords based on the input.
    const coords = [];
    list.forEach(function(item,index){
        coords.push(new Coord(item,index));
    });
    //create an array that is 500 by 500 (this is big enough based on my coords)
        //possibly, a better solution would be to just make it as big as it needs to be (largest x by largets y) //nope, because the edges matter
    const board = [];
    const boardPartTwo = [];
    let partTwoRegionSize = 0;
    for (let row = 0; row < 500 ;row++) {
        board[row] = [];
        boardPartTwo[row] = [];
        for (let col = 0; col < 500; col++) {
            //check each point on the board against each coord.
                //the point with the smallest manhatten distance gets ++ to its count
                //if there is a tie, no one gets ++
            let point = {
                x: col,
                y: row
            };
            let smallestDistance = -1; //should be big enough :RIP:
            let closestCoord = null;
            let totalDist = 0;
            coords.forEach(function(coord){
                let dist = coord.distanceFrom(point);
                totalDist += dist;
                if (dist == smallestDistance) {
                    closestCoord = null;
                } else if (dist < smallestDistance || smallestDistance == -1) {
                    smallestDistance = dist;
                    closestCoord = coord;
                }
            });
            // increase count, if needed
            if (closestCoord) {
                closestCoord.area++;
                board[row][col] = closestCoord.name;
            } else {
                board[row][col] = ".."
            }
            //part Two
            if (totalDist < 10000) {
                partTwoRegionSize++;
                // console.log(totalDist);
                boardPartTwo[row][col] = "X";
            } else {
                boardPartTwo[row][col] = ".";
            }
        }
    }
    printBoard(board, './board.txt');
    printBoard(boardPartTwo, './board2.txt');


    let largestArea = 0;
    let largestCoord = null;
    coords.forEach(function(coord){
        if (coord.area > largestArea && coord.isFinite) {
            largestArea = coord.area;
            largestCoord = coord
        }
    });
    // console.log(largestCoord);
    console.log(coords);
    console.log(partTwoRegionSize);



    //coords that don't expand into infinity should be check for safe-ness.

});

function printBoard(board, name) {
    let data = '';
    let rows = [];
    board.forEach(function(row){
        rows.push(row.join(" "))
    });
    data = rows.join(require('os').EOL);
    fs.writeFile(name,data,function(){
        console.log('done');
    });
}