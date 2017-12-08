const getPostion = (value) => {
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

// console.log(getPostion(7))
let spiralMem = [];
for(let i = 1; i < 100 ;i++){
	let {square,side,position} = getPostion(i);
	if(!spiralMem[square]){
		spiralMem[square] = [];
	}
	if(!spiralMem[square][side]){
		spiralMem[square][side] = [];
	}
	spiralMem[square][side][position] = i;
}
console.log(spiralMem);

