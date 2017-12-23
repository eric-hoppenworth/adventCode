const fs = require("fs");

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

const getPaper = (gift)=>{
	let a = gift.x * gift.y;
	let b = gift.y * gift.z;
	let c = gift.x * gift.z;

	return 2*a + 2*b + 2*c + (min([a,b,c]).value);

};

fs.readFile("./puzzle.txt","utf8",function(err,data){
	data = data.split("\r\n");
	let gifts = [];
	let total = 0;
	for (let i = 0 ; i < data.length; i++){
		let temp = data[i].split("x");
		let gift = {
			x:parseInt(temp[0],10),
			y:parseInt(temp[1],10),
			z:parseInt(temp[2],10)
		};
		gifts.push(gift);
		total += getPaper(gift);
	}
	console.log("Solution 1: ",total);
});