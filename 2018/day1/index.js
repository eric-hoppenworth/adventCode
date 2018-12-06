const fs = require("fs");

fs.readFile("./puzzle.txt","utf8",function(err,data){
    const array = data.split(require('os').EOL);
    let total = 0;
    const totals = {};
    let done = false;

    while (!done) {
        for (let i = 0; i < array.length; i++) {
            let elem = array[i];
            total += parseInt(elem,10);
            if (!totals[total]) {
                totals[total] = true;
            } else {
                console.log(total);
                done = true;
                break;
            }
        }
    }
});