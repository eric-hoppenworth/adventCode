const fs = require("fs");
const isValid = (array) => {
	for(let i = 0; i < array.length - 1; i++){
		const item = array[i];
		for (let j = i + 1; j < array.length; j++){
			if(item === array[j]){
				return false;
			}
		}
	}
	return true;
};
const getDivisors = (number)=>{
	const myMid = Math.floor(Math.sqrt(number));
	const divisorList = [1];
	for (let i = 2; i <= myMid;i++){
		//check for perfect square
		if (i*i === number){
			divisorList.push(i);
		} else if(number % i === 0){
			divisorList.push(i);
			divisorList.push(number/i);
		}
	}

	return divisorList;
};
const isPrime = (number)=>{
	if(getDivisors(number).length === 1){
		return true
	}else{
		return false
	}
};
const getProduct = (string)=>{
	let product = 1;
	for (let i = 0; i<string.length; i++){
		product *= primes[string[i].charCodeAt(0) - 97];
	}
	return product;
};
const hasNoAnagram = (array) => {
	for(let i = 0 ; i < array.length - 1 ; i++){
		for(let j = i+ 1; j < array.length; j++){
			if(getProduct(array[i]) === getProduct(array[j])){
				return false
			}	
		}
	}
	return true;
}


const primes = [];
for (let i = 2 ; true ; i++){
	if(isPrime(i)){
		primes.push(i);
	}
	if(primes.length === 26){
		break;
	}
}

fs.readFile("./puzzle.txt","utf8",function(err,data){
	const sheet = data.split("\r\n");
	let count = 0;
	for (let i = 0; i < sheet.length; i++){
		sheet[i] = sheet[i].split(" ");
		if( isValid(sheet[i])){
			count++;
		}
	}
	console.log("Solutoin 1: ",count);

	count = 0;
	for (let i = 0; i < sheet.length; i++){
		const row = sheet[i];
		if( hasNoAnagram(row) ){
			count++;
		}
	}
	console.log("Solutoin 2: ",count);

});


