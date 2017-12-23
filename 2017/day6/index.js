const fs = require("fs");
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

const distribute = (array) => {
	const result = [...array];
	let {value, index} = max(array);
	//empty current block
	result[index] = 0
	while(value > 0){
		//wrap if at the end
		index  = ( index === (array.length - 1) ) ? 0 : index + 1;
		result[index] += 1
		value --;
	}
	return result;
};

const arrayEqual =  (arr1, arr2) =>{
	if(arr1.length !== arr2.length){
		return false;
	}

	for (var i = 0 ; i < arr1.length; i++){
		if(arr1[i] !== arr2[i]){
			return false;
		}
	}
	return true;
};

const arrayInHistory = (array, history) => {
	for(var i = 0; i < history.length; i++){
		if( arrayEqual(array, history[i]) ){
			console.log(array);
			console.log(history[i]);
			console.log("Subtract to get Solution 2: ", i);
			return true;
		}
	}
	return false;
};

fs.readFile("./puzzle.txt","utf8",function(err,data){
	let list = data.split("\t");
	list = list.map((item)=> parseInt(item));
	console.log(list);
	const history = [];
	let count = 0;

	while ( !arrayInHistory(list,history) ){
		history.push(list);
		list = distribute(list);
		count++;
	}
	console.log("Solution 1: ",count);
});
