const fs = require("fs");
//(n-1 *2)

const runThrough = (list,delay=0)=>{
	let result = []
	let totalSeverity = 0;
	for(let i = 0; i < list.length; i++){
		let scanner = {...list[i]};
		if((scanner.position+delay) % scanner.distance === 0){
			scanner.willCatch = true;
			scanner.severity = scanner.position * scanner.range; 
			totalSeverity += scanner.severity;
		}
		result.push(scanner);
	}
	// console.log(result);
	return {totalSeverity,result};
}

const delayRun = (list)=>{
	let result = [];
	for(let i = 0 ; i < list.length ; i++){
		let scanner = {...list[i]}
		scanner.position++;
		result.push(scanner);
	}
	return result;
}

fs.readFile("./puzzle.txt","utf8",function(err,data){
	data = data.split("\r\n");
	let list = [];

	let totalSeverity = 0;
	for(let i = 0; i < data.length; i++){
		let temp = data[i].split(": ")
		let scanner = {
			position: parseInt(temp[0]),
			range:parseInt(temp[1]),
			willCatch: false
		}
		scanner.distance = (scanner.range - 1)*2;
		list.push(scanner);
	}
	({totalSeverity} = runThrough(list));
	console.log("Solution 1: ",totalSeverity);

	let caught = true;
	let count = 0;
	let result;
	while(caught && count < 10000000){
		if(count % 4 === 0){
			//dont even try, as scanner zero will get caught on these
			count = count + 2;
		} else{
			({totalSeverity,result} = runThrough(list,count));
			// console.log(totalSeverity);
			if(totalSeverity === 0){
				caught = false;
				// console.log("got one: ", count)
			}else{
				//i know that all of the odds will result in getting caught by scanner 1.
				count = count + 2;
			}
		}
		
	}
	console.log(count);
	
});