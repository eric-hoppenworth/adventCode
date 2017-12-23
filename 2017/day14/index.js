const fs = require("fs");
const {generateHash} = require("../day10");
const getBinary = (hexString)=>{
	let result = "";
	for(let i = 0; i < hexString.length;i++){
		let character = hexString[i];
		let binString = parseInt(character,16).toString(2);
		while(binString.length < 4){
			binString = "0"+binString;
		}
		// console.log(binString);
		result += binString
	}
	return result;
};

const checkSpace = (checkRow, checkCol, visited, queue, grid) => {
	if(checkRow >= 0 && checkRow < grid.length && checkCol >= 0 && checkCol < grid[0].length){
		if(grid[checkRow][checkCol] === "1" && !visited[checkRow][checkCol]){
			//if it exists and is equal to one, add it to the queue
			queue.unshift({row: checkRow,col: checkCol});
			grid[checkRow][checkCol] = "0";
		}
	}
}
const checkSpaces = (queue,grid,visited)=>{
	const myLocation = queue.pop();
	//check each orthagonal space
	let {col,row}  = myLocation;
	let checkRow, checkCol;


	checkRow = row - 1;
	checkCol = col;
	checkSpace(checkRow, checkCol,visited,queue,grid);
	
	checkRow = row + 1;
	checkCol = col;
	checkSpace(checkRow, checkCol,visited,queue,grid);

	checkRow = row;
	checkCol = col - 1;
	checkSpace(checkRow, checkCol,visited,queue,grid);

	checkRow = row;
	checkCol = col + 1;
	checkSpace(checkRow, checkCol,visited,queue,grid);
	
	return {grid,queue,visited};
};



let part1Complete = true;


if(!part1Complete){
	fs.readFile("./puzzle.txt","utf8",function(err,data){
		const rows = [];
		let usedCount = 0;
		for(let i = 0; i < 128; i++){
			rows.push( getBinary( generateHash(data + "-" + i) ) )
			for(let j = 0; j < rows[i].length; j++){
				if(rows[i][j] === "1"){
					usedCount++;
				}
			}
		}
		console.log(rows);
		console.log("Solution 1: ",usedCount);
		fs.writeFile("./part1.txt",JSON.stringify(rows));
	});
} else{
	fs.readFile("./part1.txt","utf8",function(err,data){
		let grid = JSON.parse(data);
		for(let i = 0 ; i < grid.length; i++){
			let string = grid[i]
			grid[i] = [];
			for(let j = 0; j < string.length; j++){
				grid[i].push(string[j]);
			}
		}
		//create empty 'visited' array
		let visited = [];
		for (var i = 0; i < grid.length; i ++){
			visited.push([]);
		}

		let queue = [];

		let groupCount = 0;

		for(let i = 0; i < grid.length; i ++){
			let myRow = grid[i];
			for (let j = 0 ; j < myRow.length; j ++){
				if(grid[i][j] === "1"){
					grid[i][j] = "0";
					let location = {row:i,col:j};
					queue.unshift(location);

					while(queue.length > 0){
						({grid,queue,visited} = checkSpaces(queue,grid,visited));
					}
					groupCount++;
				}
			}
		}
		
		

		// console.log("Queue: ",queue);
		// console.log("Grid : ", JSON.stringify(grid));
		// console.log("Visited : ",visited[0],visited[1]);
		console.log("Solution 2: ",groupCount);

	});
}

