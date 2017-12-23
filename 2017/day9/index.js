const fs = require("fs");

const scoreStream = (stream) => {
	let startCount = 0;
	let groupCount = 0;

	let totalScore = 0;

	for (let i = 0 ; i < stream.length; i ++){
		if(stream[i] === "{"){
			startCount++;
		}else if (stream[i] === "}"){
			totalScore += startCount;
			startCount --;
			groupCount++;
		}
	}
	return totalScore;
}

const scoreGarbage = (garbage) =>{
	let score = 0;
	for (let i = 0 ; i < garbage.length; i++){
		if(garbage[i] === "!"){
			//do not increase the score, and skip over the next item
			i++;
		} else {
			score++;
		}
	}
	return score;
}

fs.readFile("./puzzle.txt","utf8",function(err,data){
	
	let stream = data;
	let inGarbage = false
	let garbageStart = 0;
	let garbageEnd = 0;
	let garbageBin = [];
	for(let i = 0; i < stream.length; i++){

		if(stream[i] === "!"){
			//skip
			i++;
		}else if(stream[i] === "<"){
			if(!inGarbage){
				inGarbage = true;
				garbageStart = i;
			}
			
		}else if(stream[i]=== ">" && inGarbage){
			inGarbage = false;
			garbageEnd = i;
			//remove the garbage, replace with an 'a'
			garbageBin.push(stream.substring(garbageStart + 1, garbageEnd))
			stream = stream.substring(0,garbageStart) +"a"+ stream.substring(garbageEnd+1);
			//roll back to garbageStart
			i = garbageStart;
		}
	}
	// console.log(stream);
	//ok, all of the garbage is gone.
	console.log("Solution 1: ", scoreStream(stream));
	let garbageScore = 0;
	for(let i = 0 ; i < garbageBin.length; i++){
		garbageScore += scoreGarbage(garbageBin[i]);
	}

	console.log("Solution 2: ",garbageScore)
});
