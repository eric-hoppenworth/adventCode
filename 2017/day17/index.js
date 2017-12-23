const fs = require("fs");
function SpinLock(step){
	this.stepLength = step;
	this.currentPosition = 0;
	this.state = [0];
	this.rotationCount = 0;
}
SpinLock.prototype.insert = function(){
	this.rotationCount++;
	this.currentPosition++;
	//I am concerned with when this equals one
	// console.log(mySpinLock.currentPosition);
	this.state = [
		...this.state.slice(0,this.currentPosition),
		this.rotationCount,
		...this.state.slice(this.currentPosition)
	];
	return this.state;
}
SpinLock.prototype.stepForward = function(){
	this.currentPosition = (this.currentPosition+this.stepLength)%this.state.length;
	// if(this.currentPosition === 0){console.log(this.rotationCount)}
	return this.currentPosition;
}

function solutionOne(){
	const mySpinLock = new SpinLock(337);
	console.log( mySpinLock.currentPosition);
	for(let i = 0; i < 20; i++){
		mySpinLock.stepForward();
		mySpinLock.insert();
	}

	console.log(mySpinLock.state[mySpinLock.currentPosition-1]);
	console.log(mySpinLock.state[mySpinLock.currentPosition]);
	console.log(mySpinLock.state[mySpinLock.currentPosition+1]);
}

function solutionTwo(){
	let a = 0;
	for(let i = 0; i < 50000000; i++){
		a = ((a+337)%(i+1)) + 1;
		if(a===1){console.log(i);}
		// if(i%1000000===0){console.log(i);}
	}
}
solutionTwo();