const fs = require("fs");

const twist = (circle,command)=>{
	const result = [...circle];
	let {currentPosition,length} = command;

	for (var i = 0; i < length; i ++){
		result[getIndex(currentPosition+i)] = circle[getIndex(currentPosition+length-1-i)];
	}

	return result;
};

const getIndex = (index,divisor = 256)=>{
	return index % divisor;
}
const runCommands = (lengths,circle,skipSize=0,currentPosition=0) =>{

	for(var i = 0; i < lengths.length ; i ++){
		let length = lengths[i];
		const command = {
			currentPosition,
			length
		}
		circle = twist(circle,command);
		currentPosition = getIndex(currentPosition+skipSize+length);
		// console.log("currentPosition", currentPosition);
		skipSize++;
	}
	return {circle,skipSize,currentPosition};
};


const compactHash = (sparse) =>{
	let dense = [];
	let temp = sparse[0];

	for (let i = 1; i < sparse.length ; i ++){
		if(i % 16 === 0){
			dense.push(temp);
			temp = sparse[i];	
		}else{
			temp = temp ^ sparse[i];
		}
	}
	dense.push(temp);
	return dense;
}
const generateHash = (data)=>{
	const asciiLengths = [];
	for (let i = 0; i <data.length; i++){
		asciiLengths.push(data.charCodeAt(i));
	}
	let ending = [17, 31, 73, 47, 23]
	asciiLengths.push(...ending);
	circle = [];
	for(var i = 0;i<256;i++){
		circle[i]=i;
	}
	let skipSize = 0;
	let currentPosition = 0;
	for (let i = 0; i < 64; i++){
		( {circle,skipSize,currentPosition} = runCommands(asciiLengths,circle,skipSize,currentPosition) );
	}

	// console.log(circle);
	//this is the sparse hash, now I need to create the dense hash.
	let denseHash = compactHash(circle);
	// let a = 16;

	let hexString = "";
	for(let i = 0 ; i < denseHash.length; i++){
		let newString  = denseHash[i].toString(16)
		if(newString.length === 1){
			newString = "0" + newString;
		}
		hexString += newString;
	}
	return hexString;
}

module.exports = {
	generateHash
}
fs.readFile("./puzzle.txt","utf8",function(err,data){
	const lengths = data.split(",").map((item)=>parseInt(item));
	// console.log(lengths);
	//create circle
	let circle = [];
	for(var i = 0;i<256;i++){
		circle[i]=i;
	}
	( {circle} = runCommands(lengths,circle) );

	// console.log("Solution 1: ",circle[0]*circle[1])

	//part II
	

	var hexString = generateHash(data);
	// console.log("Solution 2: ",hexString);

});



