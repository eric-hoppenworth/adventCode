const getPosition = (value) => {
	if(value === 1){
		return {
			square: 0,
			side: 0,
			position: 0,
			value
		}
	}
	let squareIndex = Math.floor(Math.sqrt(value));
	if(squareIndex%2 === 0 ){
		//go down by one to get to the next lowest odd
		//and go down by one more because of zero-indexing
		squareIndex = squareIndex/2 ;
	} else if (squareIndex*squareIndex === value){
		squareIndex = (squareIndex-1)/2
	} else {
		squareIndex = (squareIndex-1)/2	+ 1
	}

	let lowerRoot = 2*squareIndex - 1;
	let lowerSquare = lowerRoot*lowerRoot;
	let higherRoot = lowerRoot + 2;
	let higherSquare = higherRoot*higherRoot;

	let totalLength = higherSquare - lowerSquare;
	let sideLength = totalLength / 4;
	let distance = value - lowerSquare;

	let sideIndex = Math.floor((distance-1)/sideLength);
	let positionIndex = distance - sideIndex*sideLength - 1;

	return {
		square:squareIndex,
		side: sideIndex,
		position:positionIndex,
		value,
	};
};

const getValue = (location) => {
	if(location.square === 0 && location.side === 0 && location.position === 0 ){
		return 1;
	}
	let lowerRoot = 2*(location.square - 1) + 1;
	let higherRoot = lowerRoot + 2;

	let lowerSquare = lowerRoot*lowerRoot;
	let higherSquare = higherRoot*higherRoot;

	let totalLength = higherSquare - lowerSquare;
	let sideLength = totalLength/4;

	let distance = lowerSquare + location.side*sideLength + location.position + 1;
	return distance;
};

const sumOfAdjacent = (location,spiral) => {
	if(getValue(location)===1){
		return 1;
	}
	let showLogs = false ? true : false;
	showLogs && console.log(getValue(location));
	let {square, side, position } = location;
	let innerSquare = square - 1;
	let maxPosition = square*2 - 1;
	let maxInnerPosition = innerSquare*2 - 1;
	showLogs && console.log(square,side,position);

	let total = 0;
	if(position === 0 && side === 0){
		//if both side and position are zero, there will be no adj
		total += 0
		showLogs && console.log("line 73",total);
	}else if (position === 0 && side !== 0){
		//if position is zero(but not side), we go back to the last item in the previous side
		total += spiral[square][side-1][maxPosition];
		showLogs && console.log("line 78",total);
		//in fact, if position is zero, I want the PREVIOUS two
		total += spiral[square][side-1][maxPosition-1];
		showLogs && console.log("line 80",total);		
	} else {
		//if position is not zero, I want the previous item on the same side
		total += spiral[square][side][position-1];
		showLogs && console.log(spiral[square][side][position-1])
		showLogs && console.log("line 84",total);
	}
	showLogs && console.log(spiral);
	if(innerSquare===0){
		total += 1;
	}else{	
		if(side === 3 && position > maxInnerPosition){
			//if I am rolling over to the next square
			total += spiral[square][0][0]
		}
		total += spiral[innerSquare][side][position] ? spiral[innerSquare][side][position]:0;
		showLogs && console.log("line 92",total)
		if(position===0 && side ===0){
			total += spiral[innerSquare][3][maxInnerPosition];	
			showLogs && console.log("line 95",total)
		} else if(position === 0 && side!== 0){
			total += spiral[innerSquare][side-1][maxInnerPosition];	
			showLogs && console.log("line 98",total)
		} else if(position!==0){
			total += spiral[innerSquare][side][position-1]?spiral[innerSquare][side][position-1]:0;
			showLogs && console.log("line 101",total)
			//if position was not 0, get the PREVIOUS two
			if(side===0 && position===1){
				total += spiral[innerSquare][3][maxInnerPosition];
			} else if(position===1 && side!==0){
				total += spiral[innerSquare][side-1][maxInnerPosition];
			} else{
				total+= spiral[innerSquare][side][position-2];
			}
			showLogs && console.log("line 104",total)
		}
	}
	return total;

}


// console.log(getPosition(7))
let spiralMem = [];
for(let i = 1; i < 100 ;i++){
	let {square,side,position} = getPosition(i);
	if(!spiralMem[square]){
		spiralMem[square] = [];
	}
	if(!spiralMem[square][side]){
		spiralMem[square][side] = [];
	}
	spiralMem[square][side][position] = i;
}
console.log(spiralMem);

let sumSpiral = [
	[
		[1]
	],
	[
		[1,2],
		[4,5],
		[10,11],
		[23,25]
	]
];
for(let i = 10; i < 100 ;i++){
	let {square,side,position} = getPosition(i);
	if(!sumSpiral[square]){
		sumSpiral[square] = [];
	}
	if(!sumSpiral[square][side]){
		sumSpiral[square][side] = [];
	}

	sumSpiral[square][side][position] = sumOfAdjacent({square,side,position},sumSpiral);
	if(sumSpiral[square][side][position] > 361527){
		break;
	}
}
console.log(sumSpiral);