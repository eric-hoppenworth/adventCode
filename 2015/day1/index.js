const fs = require("fs");

fs.readFile("./puzzle.txt","utf8",function(err,data){
	let floor = 0;
	let wentToBasement = false;
	for(let i = 0 ; i < data.length; i++){
		if(data[i]==="("){
			floor++;
		} else if( data[i] === ")"){
			floor--;
		}
		if(floor < 0 && !wentToBasement){
			console.log("Solution 2: ", i+1);
			wentToBasement = true;
		}
	}
	console.log("Solution 1: ",floor)
})