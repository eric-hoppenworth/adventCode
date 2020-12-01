const fs = require('fs');

function runPhase(input) {
    const pattern = [0,1,0,-1];

    input = input.split('');
    let output = [];
    for (let i = 0; i < input.length; i ++) {
        const usedPattern = [];
        let repeat = i+1;
        for (let i = 0; i < (input.length + 1); i++) {
            usedPattern.push(pattern[Math.floor(i/repeat) % pattern.length]);
        }
        // now i need to do the math part
        let total = input.map((element, index) => {
            return parseInt(element)*usedPattern[index+1];
        }).reduce((a,b) => a+b, 0);
        output.push(Math.abs(parseInt(total)%10));
    }
    return output.join('');
}
fs.readFile('./puzzle.txt', 'utf8', function(err, data){
    let input = data.repeat(100);
    // this is clearly not the solution.  6500000 is too big.
    // since it repeats, I could try 'saving' some results and just repeating those.
    for (let n = 0; n < 1; n++) {
        input = runPhase(input)
    }
    console.log(input.substring(0,8));
    fs.writeFile('./solution.txt',input,function(){

    });
});