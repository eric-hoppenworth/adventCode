const fs = require("fs");

const compareCounters = (a,b) => {
    let totalDifference = 0;
    const letters = [];
    for (let i = 97; i < 123; i++) {
        letters.push(String.fromCharCode(i));
    }

    for (let i = 0; i < letters.length; i++) {
        if (!a[letters[i]]) {
            a[letters[i]] = 0;
        }
        if (!b[letters[i]]) {
            b[letters[i]] = 0;
        }
        totalDifference += Math.abs(a[letters[i]] - b[letters[i]]);
        if (totalDifference > 2) {
            return false;
        }
    }
    // console.log(totalDifference);
    if (totalDifference == 2) {
        return true;
    } else {
        return false;
    }
};

fs.readFile("./puzzle.txt","utf8",function(err,data){
    const array = data.split(require('os').EOL);
    let twos = 0;
    let threes = 0;
    const counters = [];
    array.forEach(function(elem){
        const counter = {};
        for (let i = 0; i < elem.length; i++) {
            if (counter[elem[i]]) {
                counter[elem[i]]++;
            } else {
                counter[elem[i]] = 1;
            }
        }
        let hasAThree = false;
        let hasATwo = false;
        for (let key in counter) {
            if (counter[key] == 3) {
                hasAThree = true;
            }
            if (counter[key] == 2) {
                hasATwo = true;
            }
        }
        if (hasAThree) {
            threes++;
        }
        if (hasATwo) {
            twos++;
        }
        counters.push(counter)
    });
    console.log(twos * threes); //solution 1
    // console.log(counters);
    for (let i = 0; i < counters.length - 1; i++) {
        for (let j = i+1; j < counters.length; j++) {
            let res = compareCounters(counters[i],counters[j]);
            if (res) {
                //technically this doesn't narrow down to one--the question was unclear as to if order of the letters mattered.
                //manualy inspection from here should be trivial.
                console.log(array[i],array[j]);
            }
        }
    }
});
