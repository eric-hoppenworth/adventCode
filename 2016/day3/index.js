const fs = require('fs');
function Triangle(a,b,c) {
    this.a = parseInt(a,10);
    this.b = parseInt(b,10);
    this.c = parseInt(c,10);
}
Triangle.prototype.isValid = function() {
    let longestSide = '';
    let sides = ['a','b','c'];
    if (this.a >= this.b && this.a >= this.c) {
        longestSide = 'a';
    }
    if (this.b >= this.a && this.b >= this.c) {
        longestSide = 'b';
    }
    if (this.c >= this.b && this.c >= this.a) {
        longestSide = 'c';
    }

    let sumOfOtherSides = 0;
    sides.forEach((side)=>{
        if (side!=longestSide) {
            sumOfOtherSides += this[side];
        }
    });
    return sumOfOtherSides > this[longestSide];
}

fs.readFile("./puzzle.txt",'utf8',function(err, data){
    const lines = data.split('\n');
    let possibleCount = 0;
    const triangleList = [];
    lines.forEach((line)=>{
        let arr = [line.substring(0,3),line.substring(5,8),line.substring(10)];
        triangleList.push(arr);
        // let myTriangle = new Triangle(...arr);
        // if (myTriangle.isValid()) {
        //     possibleCount++;
        // }
    });
    for (let n = 0; n < 3; n++) {
        for (let i = 0; i < triangleList.length; i+=3) {
            let myArr = [];
            for (let j = 0; j < 3; j++) {
                myArr.push(triangleList[i+j][n]);
            }
            let myTriangle = new Triangle(...myArr);
            if (myTriangle.isValid()) {
                possibleCount++;
            }
        }
    }

    console.log(possibleCount);
});
