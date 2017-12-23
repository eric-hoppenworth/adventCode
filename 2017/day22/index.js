function Vector(row,col){
	this.row = row;
	this.col = col;
}
Vector.prototype.add = function(vect){
	return new Vector(this.row + vect.row, this.col + vect.col);
};
const fs = require("fs");
const directions = {
	up: {
		vector: new Vector(-1,0),
		back:"down",
		left: "left",
		right:"right",
		forward: "up"
	},
	down: {
		vector: new Vector(1,0),
		back:"up",
		left: "right",
		right:"left",
		forward: "down"
	},
	left: {
		vector: new Vector(0,-1),
		back:"right",
		left: "down",
		right:"up",
		forward: "left"
	},
	right: {
		vector: new Vector(0,1),
		back:"left",
		left: "up",
		right:"down",
		forward: "right"
	}
};
const status = {
	clean: { 
		newStatus:"weakened",
		direction: "left"
	},
	weakened: {
		newStatus: "infected",
		direction: "forward"
	},
	infected: {
		newStatus: "flagged",
		direction: "right"
	},
	flagged: {
		newStatus: "clean",
		direction: "back"
	}
}
function Virus(start, direction){
	this.position = start;
	this.direction = direction;
	this.totalInfect = 0;
}
Virus.prototype.turn = function(dir){
	this.direction = directions[this.direction][dir];
};
Virus.prototype.move = function(){
	//virus moves in the direction it is facing
	this.position = this.position.add(directions[this.direction].vector);
};
Virus.prototype.infect = function(grid){
	let {row,col} = this.position;

	let myStatus = grid[row][col]
	grid[row][col] = status[ myStatus ].newStatus;
	if(grid[row][col] === "infected"){
		this.totalInfect++;
	}

};
Virus.prototype.burst = function(grid){
	let {row,col} = this.position;
	if(!grid[row]){
		grid[row] = {};
	}
	if(!grid[row][col]){
		grid[row][col] = "clean";
	}
	//turn
	let myStatus = grid[row][col];
	this.turn( status[ myStatus ].direction )
	//infect
	this.infect(grid);
	//move
	this.move();
};

const systemCheck = (grid)=>{
	let infectedCount = 0;
	for(row in grid){
		for(col in grid[row]){
			if(grid[row][col] === "infected"){
				infectedCount ++;
			}
		}
	}
	return infectedCount;
}

fs.readFile("./puzzle.txt","utf8",function(err,data){
	data = data.split("\r\n");
	let grid = {};
	for(let i = 0 ; i < data.length; i++){
		if(!grid[i]){
			grid[i] = {};
		}
		for(let j = 0 ; j < data[i].length; j++){
			grid[i][j] = data[i][j] === "#" ? "infected" : "clean";
		}
	}
	let virus = new Virus(new Vector(12,12),"up");

	for(let i = 0; i < 10000000; i++){
		virus.burst(grid);
	}
	// console.log(systemCheck(grid));
	console.log(virus.totalInfect)
	
	
});