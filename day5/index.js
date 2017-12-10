const fs = require("fs");

fs.readFile("./puzzle.txt","utf8",function(err,data){
	let list = data.split("\r\n");
	list = list.map((item)=> parseInt(item));
	// console.log(list)
	let current = 0;
	let count = 0;
	while( current >= 0 && current < list.length) {
		let start = current;
		current += list[start];
		list[start] += 1;
		count++;
	}
	console.log("Solution 1: ",count);


	list = data.split("\r\n");
	list = list.map((item)=> parseInt(item));
	current = 0;
	count = 0;
	while( current >= 0 && current < list.length) {
		let start = current;
		current += list[start];
		if(list[start] >= 3){
			list[start] -= 1;
		} else{
			list[start] += 1;
		}

		count++;
	}
	console.log("Solution 2: ",count);
});