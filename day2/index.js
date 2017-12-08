const fs = require("fs");

fs.readFile("./puzzle.txt","utf8",function(err,data){
	console.log(data);
	const sheet = data.split("\r\n");
	for (let i = 0; i < sheet.length; i++){
		sheet[i] = sheet[i].split("\t");
		for(let j = 0 ; j < sheet[i].length; j ++){
			sheet[i][j] = parseInt( sheet[i][j] , 10 );
		}
	}

	let checkSum = 0;

	for (let i = 0; i < sheet.length; i++){
		checkSum += getDifference(sheet[i]);
	}
	console.log("Solution 1: ",checkSum);

	let divisionSum = 0;
	for (let i = 0; i < sheet.length; i++){
		divisionSum += findDivision(sheet[i]);
	}
	console.log("Solution 2: ",divisionSum);

})





const min = (array) =>{
	const lowest = {
		value: array[0],
		index: 0
	};
	
	for (let i = 0; i < array.length; i++){
		if(array[i] < lowest.value){
			lowest.value = array[i];
			lowest.index = i;
		} 
	}
	return lowest;
};

const max = (array) =>{
	const highest = {
		value: array[0],
		index: 0
	};

	for (let i = 0; i < array.length; i++){
		if (array[i] > highest.value){
			highest.value = array[i];
			highest.index = i
		}
	}
	return highest;
};


const getDifference = (array)=>{
	let low = min(array).value;
	let high = max(array).value;

	return high - low;
};


const findDivision = (array) => {
	for(let i = 0 ; i < array.length ; i++){
		const first = array[i];
		for (let j = 0 ; j < array.length; j ++){
			if( i !== j){
				const second = array[j];
				if(first % second === 0){
					return first/second;
				}
			}
		}
	}
}