// Generator A starts with 618, 16807
// Generator B starts with 814, 48271

function Generator (startValue, factor,selector = 1){
	this.output = startValue;
	this.factor = factor;
	this.divider = 2147483647;
	this.selector = selector
}
Generator.prototype.getBinary = function(){
	let bin = (this.output).toString(2);
	while(bin.length < 16){
		bin = "0" + bin;
	}
	if(bin.length > 16){
		bin = bin.substring(bin.length - 16);
	}
	return bin;
};
Generator.prototype.next = function(){
	let result = (this.output*this.factor) % this.divider;
	this.output = result;
	if(this.output % this.selector === 0){
		return this.getBinary();
	} else {
		return this.next();
	}
	
}

let currentPuzzle = 2;
if(currentPuzzle ===1){
	let genA = new Generator(618,16807);
	let genB = new Generator(814,48271);

	let judgeCount = 0;
	for(let i = 0; i < 40000000; i++){
		if(genA.next() === genB.next()){
			judgeCount++;
		}
		if(i % 1000000 === 0){
			console.log(i);
		}
	}
	console.log("Solution 1: ",judgeCount);

}else if(currentPuzzle === 2){
	let genA = new Generator(618,16807,4);
	let genB = new Generator(814,48271,8);

	let judgeCount = 0;
	for(let i = 0; i < 5000000; i++){
		if(genA.next() === genB.next()){
			judgeCount++;
		}
		if(i % 100000 === 0){
			console.log(i);
		}
	}
	console.log("Solution 2: ",judgeCount);
}

