const fs = require("fs");
const getArrangements = function(a){
	let Tf ="";
	let count = 0;
	for(let i = 0; i < a.length; i++){
		for(let j = 0; j < a[i].length; j ++){
			Tf += a[i][j];
			if(a[i][j]==="#"){
				count++;
			}
		}
		if(i != a.length - 1){
			Tf += "/";	
		}
	}
	let Tb ="";
	for(let i = 0; i < a.length; i++){
		for(let j = a[i].length - 1; j >= 0; j--){
			Tb += a[i][j];
		}
		if(i != a.length - 1){
			Tb += "/";	
		}
	}
	let Bf ="";
	for(let i = a.length - 1; i >= 0 ; i--){
		for(let j = 0; j < a[i].length; j ++){
			Bf += a[i][j];
		}
		if(i != 0){
			Bf += "/";	
		}
	}
	let Bb ="";
	for(let i = a.length - 1; i >= 0 ; i--){
		for(let j = a[i].length - 1; j >= 0; j --){
			Bb += a[i][j];
		}
		if(i != 0){
			Bb += "/";	
		}
	}
	let Rf ="";
	for(let i = a.length - 1; i >= 0 ; i--){
		for(let j = 0; j < a[i].length; j ++){
			Rf += a[j][i];
		}
		if(i != 0){
			Rf += "/";	
		}
	}
	let Rb ="";
	for(let i = a.length - 1; i >= 0 ; i--){
		for(let j = a[i].length - 1; j >= 0; j --){
			Rb += a[j][i];
		}
		if(i != 0){
			Rb += "/";	
		}
	}
	let Lf ="";
	for(let i = 0; i < a.length; i++){
		for(let j = 0; j < a[i].length; j ++){
			Lf += a[j][i];
		}
		if(i != a.length - 1){
			Lf += "/";	
		}
	}
	let Lb ="";
	for(let i = 0; i < a.length; i++){
		for(let j = a[i].length - 1; j >= 0; j--){
			Lb += a[j][i];
		}
		if(i != a.length - 1){
			Lb += "/";	
		}
	}
	
	return {
		arr: [Tf,Tb,Bf,Bb,Rf,Rb,Lf,Lb],
		count
	};
};

function Template(string){
	let temp = string.split(" => ");
	this.input = temp[0];
	let output = temp[1].split("/");
	this.output = [];
	for(let i = 0; i < output.length; i++){
		this.output.push(output[i].split(""));
	}
	this.size = this.output.length - 1;
	this.count = 0;
	for(let i = 0 ; i < this.input.length; i++){
		if(this.input[i]==="#"){
			this.count++;
		}
	}
}

function Fractal(){
	this.grid = [
		[".","#","."],
		[".",".","#"],
		["#","#","#"]
	]; 
}
Fractal.prototype.split = function(){
	const splitSize = this.grid.length % 2 === 0 ? 2 : 3;
	let splits = [];
	for(let row = 0; row < this.grid.length-1; row += splitSize){
		splits.push([]);
		for(let col = 0; col < this.grid.length-1; col += splitSize){

			let mySplit = [];
			for(let i = 0; i <splitSize; i++){
				mySplit.push([]);
				for(let j = 0; j <splitSize; j++){
					// console.log(i,j);

					mySplit[i][j] = this.grid[row + i][col + j];
					// console.log(mySplit);
				}
			}

			splits[splits.length - 1].push(mySplit);
		}
	}
	//returns a 2-dimensional array of 2-dimentional arrays.
	return splits;
};
Fractal.prototype.combine = function(splitArray){
	let grid = [];
	let splitSize = splitArray[0][0].length; //this is the size of each piece, either 2 or 3
	let gridRows = [];
	for(let row = 0; row < splitArray.length; row++){
		let myRow = splitArray[row];

		for(let col = 0 ; col < myRow.length; col++){
			let mySplit = myRow[col];

			for(let i = 0; i < mySplit.length; i++){
				for(let j = 0; j < mySplit.length; j++){
					let realRow = i+(row*splitSize)
					if(!gridRows[realRow]){
						gridRows[realRow] = "";
					}

					gridRows[realRow] += mySplit[i][j];
				}
			}
		}
	}
	for(let i = 0; i < gridRows.length; i ++){
		grid[i] = gridRows[i].split("");
	}
	this.grid = grid;
};
Fractal.prototype.morph = function(templates){
	//split fractal
	let mySplits = this.split();
	for(let i = 0 ; i < mySplits.length; i ++){
		for (let j = 0 ; j < mySplits.length; j++){
			let split = mySplits[i][j]
			//compare split array to templates to get output grid
			//get an output for each item in the 2D split array
			mySplits[i][j] = getOutput(split, templates);
		}
	}
	//recombine the outputs back into a single fractal grid.
	this.combine(mySplits);
};
Fractal.prototype.count = function(str = "#"){
	let result = 0;
	for(let i = 0 ; i < this.grid.length; i++){
		for (let j = 0 ; j < this.grid.length; j++){
			if(this.grid[i][j]===str){
				result++;
			}
		}
	}
	return result;
}

const getOutput = function(split,templates){
	let {arr, count } = getArrangements(split);
	for(let i = 0 ; i < templates.length; i++){
		let myTemplate = templates[i];
		if(myTemplate.count === count){
			for(let j = 0; j < arr.length; j++){
				if( arr[j] === myTemplate.input){
					return myTemplate.output;
				}
			}
		}else{
			//next template
		}
	}
};

fs.readFile("./puzzle.txt","utf8",function(err,data){
	data = data.split("\r\n");
	let templates = [];
	for (let i = 0 ; i < data.length; i ++){
		templates.push(new Template(data[i]));
	}
	// console.log(templates);

	//create fractal
	let myFractal = new Fractal();

	for(let i = 0; i < 18; i++){
		myFractal.morph(templates);
	}
	
	console.log( myFractal.count() );
	//repeat
});