const fs = require("fs");
let moves = 0;

function Program(id,connections){
	this.id = id;
	this.connections = connections;
	this.children = [];
}

Program.prototype.fetchChildren = function(census){
	let result = [...census];
	for(let i = 0; i < this.connections.length ; i++){
		let item = this.connections[i];
		if(result[item]){
			moves++;
			this.children.push(result[item]);
			delete result[item];
			result = this.children[this.children.length - 1].fetchChildren(result);
			
		}
	}

	
	return result;
}


fs.readFile("./puzzle.txt","utf8",function(err,data){
	data = data.split("\r\n");
	let census = [];
	for(let i = 0; i < data.length; i++){
		let temp = data[i].split(" <-> ")
		temp[1] = temp[1].split(", ");
		let myProgram = new Program(temp[0],temp[1])
		census.push(myProgram);
	}
	// console.log(census);
	let groups = [];
	let count = 0;
	moves = 0;
	
	for(let i = 0 ; i < census.length; i ++){
		moves = 0;
		if(census[i]){
			moves++;
			groups.push(census[i]);
			delete census[i];
			census = groups[count].fetchChildren(census);
			if(count ===0){
				console.log("Solution 1: ",moves);
			}
			count++;
		}
	}
	console.log("Solution 2: ",groups.length);

})