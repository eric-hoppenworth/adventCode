const fs = require("fs");
function Pipe(string){
	let temp = string.split("/");
	this.ports = [parseInt(temp[0],10),parseInt(temp[1],10)];
	this.string = string;
}
Pipe.prototype.hasFree = function(pins){
	let result = false;
	for(let i = 0; i < this.ports.length; i++){
		if(this.ports[i] === pins){
			result = true;
		}
	}
	return result;
};

function Chain(pipes){
	this.total = 0;
	this.end = 0;
	this.remainingPipes = [...pipes];
	this.nextPipes = [];
	this.complete = false;
	this.string = "0";
}
Chain.prototype.addPipe = function(index){
	let pipe = this.nextPipes[index];
	let result = new Chain(this.remainingPipes);
	for(let i = 0 ; i < this.nextPipes.length; i++){
		if(i !== index){
			result.remainingPipes.push( this.nextPipes[i])
		}
	}
	result.total = this.total;
	result.end = this.end
	// console.log("end ",this.end);
	result.string = this.string + "/" + pipe.string;
	for(let i = 0 ; i < pipe.ports.length; i++){
		result.total += pipe.ports[i];
		// console.log("boolean: ",pipe.ports[i],result.end)
		if(pipe.ports[i] !== this.end){
			result.end = pipe.ports[i];
			// console.log(i);
		}
		// console.log("pipe ",pipe.ports[i]);
	}
	result.findPipes();
	// console.log("end ",result.end);
	return result;
};
Chain.prototype.findPipes = function(){
	for(let i = this.remainingPipes.length - 1 ; i >= 0; i--){
		let myPipe = this.remainingPipes[i];
		if(myPipe.hasFree(this.end)){
			this.nextPipes.push(myPipe);
			this.remainingPipes.splice(i,1);
		}
	}
	if(this.nextPipes.length === 0){
		this.complete = true;
	}
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

const findLongest = (chains)=>{
};

fs.readFile("./puzzle.txt","utf8",function(err,data){
	data = data.split("\r\n");
	let pipes = [];
	let totals = [];
	let longest = {
		string : "0",
		total: 0
	};
	for (let i = 0; i < data.length; i++) {
		pipes.push( new Pipe(data[i]) );
	}
	// console.log(pipes);
	let chains = [];

	let firstChain = new Chain(pipes);
	firstChain.findPipes();
	chains.push(firstChain);

	
	for(let i = 0 ; i < chains.length; i++){
		let chain = chains[i];
		if(!chain.complete){
			for(let i = 0 ; i < chain.nextPipes.length; i++){
				chains.push(chain.addPipe(i));
			}	
		}
		if(chain.string.length > longest.string.length){
			longest = {
				string: chain.string,
				total: chain.total
			};
		}else if(chain.string.length === longest.string.length){
			if(chain.total > longest.total){
				longest = {
					string: chain.string,
					total: chain.total
				};
			}
		}
		totals.push(chain.total);
	}
	// fs.writeFile("./output.json",JSON.stringify(chains.slice(0,50),null,2),()=>{});
	let highest = max(totals);
	console.log(totals.length);
	console.log(chains.length);
	console.log(highest);
	console.log(longest);
});