const fs = require("fs");

const findDistance = (path)=>{
	let northTotal = path.ne + path.nw + (path.n*2);
	let southTotal = path.se + path.sw + (path.s*2);
	let eastTotal = path.se + path.ne;
	let westTotal = path.sw + path.nw;
	let upTotal = northTotal - southTotal;
	let rightTotal = eastTotal - westTotal;
	// console.log(upTotal,rightTotal);
	let totalSteps = (upTotal + rightTotal)/2;
	// console.log(totalSteps);
	return totalSteps;
}

fs.readFile("./puzzle.txt","utf8",function(err,data){
	const list = data.split(",");
	let highestDistance = 0;
	const path = {n:0,s:0,ne:0,nw:0,se:0,sw:0};
	for (let i = 0; i < list.length; i++){
		path[list[i]]++;	
		let distance = findDistance(path);
		if(distance > highestDistance){
			highestDistance = distance;
		}
	}
	console.log("Solution 1: ",findDistance(path));
	console.log("Solution 2: ", highestDistance);
})