const fs = require("fs");
fs.readFile("./plates.txt","utf8",function(err,data){
	const plateArray = data.split("\r\n");
	const plateTower = {};
	let end = plateArray.length
	for (let i = 0; i < end ; i++){
		//see if it has an arrow...
		let tempArray = plateArray[i].split(" -> ");
		let nameWeight = tempArray[0].split(" (");
		let name = nameWeight[0];
		let weight = nameWeight[1].slice(0,nameWeight[1].length - 1);

		//now see if there are child plates
		plateTower[name] = {};
		plateTower[name].weight = parseInt(weight,10);
		if (tempArray[1]){
			
			let children = {};
			tempArray[1].split(", ").map(function(item){
				children[item] = 0;
			});
			plateTower[name].children = children;
			plateTower[name].total = 0;
		} else {
			plateTower[name].next = true;
			plateTower[name].total = plateTower[name].weight;
		}
		plateTower[name].moved = 0;
		plateTower[name].holding = 0;
		
	}

	let newTower = moveChildren(plateTower);
	console.log(newTower);
	fs.writeFile("./tree.txt",JSON.stringify(newTower));


});

const moveChildren = (tower) => {
	const result = { ...tower };

	if(Object.keys(result).length === 1){
		//one and done
		return result;
	} else {
		for(key in result){
			if(result[key].children){
				let movedChildren = 0;
				for(plate in result[key].children){
					//the the plate must not have children of its own
					if(tower[plate] && tower[plate].next){
						//we don't always move all of the children at once....
						result[key].moved++;
						result[key].children[plate] = { ...tower[plate] };
						result[key].holding += result[key].children[plate].holding + result[key].children[plate].weight
						result[key].children[plate].next = false;
						delete result[plate];
	
					}
					if(result[key].moved === Object.keys(result[key].children).length){
						result[key].total = result[key].weight + result[key].holding;
						result[key].next = true;
					}
				}
			}
		}
		//recurse
		return moveChildren(result);
	}
};