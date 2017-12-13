const fs = require("fs");

fs.readFile("./puzzle.txt","utf8",function(err,data){
	const myLoop = data;
	let total = 0;
	for(let i = 0; i < myLoop.length - 1; i++){
		if(myLoop[i] === myLoop[i+1]){
			total += parseInt(myLoop[i]);
		}
	}
	if(myLoop[0]===myLoop[myLoop.length-1]){
		total += parseInt(myLoop[0]);
	}
	console.log("Solution 1: ",total);

	let halfWaytotal = 0;
	const half = myLoop.length/2

	for(let i = 0; i < half; i++){
		if(myLoop[i] === myLoop[i+half]){
			halfWaytotal += parseInt(myLoop[i]);
		}
	}
	halfWaytotal *= 2
	console.log("Solution 2: ",halfWaytotal);

})