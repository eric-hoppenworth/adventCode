const fs = require("fs");

function Command(string,index){
	let temp = string.split(" ");
	this.type = temp[0];
	this.registerName = temp[1];
	this.right = temp[2] || 0;
	this.index = index;
	this.string = string;
}
Command.prototype.execute = function(registers) {
	let myRegister = registers[this.registerName] ?
		registers[this.registerName] :
		{
			value: parseInt(this.registerName)
		};
	let cmdValue = isNaN(parseInt(this.right) ) ? 
		registers[this.right].value:
		parseInt(this.right,10);

		// console.log(myRegister);
		// console.log(cmdValue);
	switch(this.type){
		case "set":
			myRegister.value = cmdValue;
			break;
		case "sub":
			myRegister.value -= cmdValue;
			break;
		case "mul":
			myRegister.value *= cmdValue;
			break;
		case "jnz":
			console.log(registers);
			// console.log(this.registerName);
			console.log(this.string);
			if(myRegister.value != 0){
				return {
					myRegister,
					nextIndex: this.index + cmdValue
				};
			}
	}
	//returns the register that was just changed, and the next index
	return {
		myRegister,
		nextIndex: this.index + 1
	};
};

const partOne = ()=>{
	fs.readFile("./puzzle.txt","utf8",function(err,data){
		let list = data.split("\r\n");
		const commands = [];
		// const registers = {};
		for(let i = 0 ; i < list.length; i++){
			let cmd = new Command(list[i],i);
			commands.push(cmd);
		}
		// console.log( commands )
		let index = 0;
		let registers = {
			a: {value: 0},
			b: {value: 0},
			c: {value: 0},
			d: {value: 0},
			e: {value: 0},
			f: {value: 0},
			g: {value: 0},
			h: {value: 0}
		};
		let totalCount = 0;
		while(index >= 0 &&  index < commands.length){
			let result = commands[index].execute(registers);
			// console.log(registers["h"]);
			// if(index === 9){
			// 	registers["d"].value = 107898;
			// }
			index = result.nextIndex;
			totalCount++;

		}
		// console.log(multiplyCount);
	});
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

const partTwo = ()=>{
	let b = 107900;
	let c = 124900;
	let h = 0;
	while(b < c){
		let d = 2;
		let e = 2;
		if(!isPrime(b)){
			h++;
		}
		b += 17;
	}
	console.log("Done",h);
}

partTwo();

