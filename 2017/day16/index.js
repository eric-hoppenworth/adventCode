const fs = require("fs");

function DanceMove(string){
	let tempArr = string.split("/");
	this.type = tempArr[0][0];
	this.left = tempArr[0].substring(1);
	this.right = tempArr[1] || undefined;
}

DanceMove.prototype.dance = function(array){
	let result;
	switch(this.type){
		case "s":
			let swapPosition = array.length - this.left;
			return [
				...array.slice(swapPosition),
				...array.slice(0,swapPosition)
			];
		case "x":
			result = [...array];
			result[this.left] = array[this.right];
			result[this.right] = array[this.left];
			return result;
		case "p":
			//
			let left;
			let right;
			for (let i = 0; i < array.length; i++){
				if (array[i]===this.left){
					left = i;
				} else if(array[i]===this.right){
					right = i;
				}
				if(left && right){
					//exit loop if i get both
					i = array.length;
				}
			}
			result = [...array];
			result[left] = array[right];
			result[right] = array[left];
			return result;
	}
}
const performDance = (programs,list)=>{
	for(let i = 0 ; i < list.length; i ++){
		let myMove = new DanceMove(list[i]);
		// console.log(myMove);
		// console.log(programs.join(""));
		programs = myMove.dance(programs);
		
	}

	// console.log(programs.join(""));
	return programs;
}
fs.readFile("./puzzle.txt", "utf8", function(err,data){
	let list = data.split(",");
	let programs = [];
	for(let i = 97 ;i < (97+16);i++){
		programs.push(String.fromCharCode(i));
	}
	let moves = [];
	for(let n = 0; n < (1000000000%60) ; n++){
		programs = performDance(programs,list);
		// console.log(programs.join(""));
		// the sequence repeats every 60 times
		// if(programs.join("")==="abcdefghijklmnop"){console.log(n);}
	}
	console.log("Solution 2:", programs.join(""))
});

// "kbednhopmfcjilag"