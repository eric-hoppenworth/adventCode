const fs = require("fs");


const performCommand = (register, command)=>{
	const {key,value,otherKey,comparison,compareValue} = command;
	if(!register[key]){
		register[key] = 0;
	}
	if(!register[otherKey]){
		register[otherKey] = 0;
	}

	let checkCompare = false;
	switch(comparison){
		case "<":
			checkCompare = register[otherKey] < compareValue
			break;
		case ">":
			checkCompare = register[otherKey] > compareValue
			break;
		case "==":
			checkCompare = register[otherKey] === compareValue
			break;
		case "!=":
			checkCompare = register[otherKey] !== compareValue
			break;
		case "<=":
			checkCompare = register[otherKey] <= compareValue
			break;
		case ">=":
			checkCompare = register[otherKey] >= compareValue
			break;
		default:
			return "invalid command"
	}
	if (checkCompare){
		register[key] += value;
		return register[key];
	}
};


fs.readFile("./puzzle.txt","utf8",function(err,data){
	const register = {};
	let highestValue = 0;
	const sheet = data.split("\r\n");
	for (let i = 0; i < sheet.length; i++){
		sheet[i] = sheet[i].split(" ");
		//sheet[i] = [key, inc/dec, value, "if", otherKey, comparison, compareValue]
		const command = {};
		command.key = sheet[i][0];
		command.value = sheet[i][1] === "inc" ? parseInt(sheet[i][2] ,10) : ( -1 * parseInt(sheet[i][2] ,10) );
		command.otherKey = sheet[i][4];
		command.comparison = sheet[i][5];
		command.compareValue = parseInt( sheet[i][6],10 );

		let newValue = performCommand(register,command);
		if(newValue > highestValue){
			highestValue = newValue;
		}
	}
	console.log(highestValue);
	console.log(register);
});

