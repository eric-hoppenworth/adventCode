const fs = require('fs');


function Program(number,commands,otherProgram = 0){
	this.queue = [];
	this.registers = {};
	this.commands = commands;
	for(let i = 0 ; i < commands.length; i++){
		let cmd = commands[i];
		//create register if I need to
		if(isNaN(parseInt(cmd.registerName))){
			if(!this.registers[cmd.registerName]){
				this.registers[cmd.registerName] = {
					value: 0,
					lastSound: 0
				}
			}
		}
	}

	this.registers["p"].value = number;
	this.index = 0;
	this.number = number;
	this.sendCount = 0;
	this.otherProgram = otherProgram
}
Program.prototype.run = function(){
	while(this.index >= 0 && this.index < this.commands.length){
		let cmd = this.commands[this.index];
		let result = cmd.execute(this);
		// console.log(result);
		this.index = result.nextIndex;
	}
}

function Command(string,index){
	let temp = string.split(" ");
	this.type = temp[0];
	this.registerName = temp[1];
	this.right = temp[2] || 0;
	this.index = index;
}
Command.prototype.execute = function(program) {
	let {registers} = program;
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
		case "add":
			myRegister.value += cmdValue;
			break;
		case "mul":
			myRegister.value *= cmdValue;
			break;
		case "mod":
			myRegister.value %= cmdValue;
			break;
		case "snd":
			//send to the end of the queue of the other program
			program.sendCount++
			program.otherProgram.queue.push(myRegister.value);
			break;
		case "rcv":
			//pull out of your own queue
			if(program.queue.length > 0){
				cmdValue = program.queue.shift();
				myRegister.value = cmdValue;
			}else{
				if(program.otherProgram.queue.length > 0){
					program.otherProgram.run();
				}else{
					console.log("deadlock");
					console.log("program ",program);
					this.index = -10;
				}
				
			}
			break;
		case "jgz":
			if(myRegister.value > 0){
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


fs.readFile("./puzzle.txt","utf8",function(err,data){
	let list = data.split("\r\n");
	const commands = [];
	// const registers = {};
	for(let i = 0 ; i < list.length; i++){
		let cmd = new Command(list[i],i);
		commands.push(cmd);
	}
	let program0 = new Program(0,commands);
	let program1 = new Program(1,commands);
	program0.otherProgram = program1;
	program1.otherProgram = program0;
	program0.run();
})