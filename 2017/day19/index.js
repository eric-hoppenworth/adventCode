const fs = require("fs");
const dir = {
	up: {
		row: -1,
		col:0,
		back:"down",
		left: "left",
		right:"right"
	},
	down: {
		row: 1,
		col: 0,
		back:"up",
		left: "right",
		right:"left"
	},
	left: {
		row: 0,
		col : -1,
		back:"right",
		left: "down",
		right:"up"
	},
	right: {
		row: 0,
		col: 1,
		back:"left",
		left: "up",
		right:"down"
	}
};
const add = function(position1,position2){
	return {
		row: position1.row + position2.row,
		col: position1.col + position2.col
	}
}

function Program(start, direction = "down"){
	this.position = start;
	this.direction = direction;
	this.letters = [];
	this.stepCount = 1;
}
Program.prototype.move = function(grid){
	let reg = /[A-Z]/;
	let item = grid[this.position.row][this.position.col];
	while(item != "+" && item != "P"){
		this.position = add(this.position,dir[this.direction]);
		this.stepCount++;
		if( reg.test(item) ){
			this.letters.push(item);
		}
		item = grid[this.position.row][this.position.col];
	}
	// console.log("moved: ",this);
	if(item === "+"){
		this.turn(grid);
	}else if(item == "P"){
		this.letters.push(item);
		console.log("Solution 1: ",this.letters);
		console.log("Solution 2: ", this.stepCount);
	}

};
Program.prototype.turn = function(grid){
	let {back} = dir[this.direction]
	this.stepCount++;
	for(direction in dir){
		if(direction != this.direction && direction != back){
			let newPosition = add(this.position, dir[direction]);
			if(grid[newPosition.row][newPosition.col] != " "){
				this.position = newPosition;
				this.direction = direction;
				break;
			}
		}
	}
	// console.log("turned: ", this);
	this.move(grid);
}


fs.readFile("./puzzle.txt","utf8",function(err,data){
	let rows = data.split("\r\n");
	let grid = [];
	for(let i = 0; i < rows.length; i++){
		let row = rows[i].split("");
		grid.push(row);
	}
	let myProgram;
	for(let col = 0; col < grid[0].length; col++){
		if(grid[0][col]=== "|"){
			myProgram = new Program({row:0,col});
			break;
		}
	}
	// console.log(myProgram);
	myProgram.move(grid);

});