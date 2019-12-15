const fs = require("fs");

function SkyOrb (parent, id) {
    this.id = id;
    this.directParent = parent;
    this.parentCount = -1;
    this.santaTravel = 0;
}

fs.readFile("./puzzle.txt","utf8",function(err,data){

    const skyOrbs = data.split(require('os').EOL).map((a) => new SkyOrb(...a.split(')')));
    const com = new SkyOrb(null, "COM")
    com.parentCount = 0;
    skyOrbs.push(com);
    const orbHash = {};
    skyOrbs.forEach(function(orb){
        orbHash[orb.id] = orb;
    });
    const ends = {...orbHash};
    skyOrbs.forEach(function(orb){
        delete ends[orb.directParent];
    });
    // so now I have a list of the ends.
    // for each end, I can go down the list until I find a parent that has a count bigger than -1.
    // then, I have to go back UP the list and assign 1 number higher each time
    for (id in ends) {
        let myEnd = ends[id];
        let count = 0;
        while(myEnd) {
            count++;
            myEnd = orbHash[myEnd.directParent];
        }
        myEnd = ends[id];
        while(myEnd) {
            myEnd.parentCount = --count;
            myEnd = orbHash[myEnd.directParent];
        }
    }
    console.log(skyOrbs.reduce((carry, a) => carry += a.parentCount, 0));
    // to find santa, I can actually cheat.
    // the quickest path MUST include some common branch back to the start (because all paths do).
    // I can have Santa travel back to the start, and mark his progress.
    // then I will go back until I visit a orb that he also did.
    // I can add the number of steps he traveled to get there, plus the number I traveled.
    // finaally, I subtract 2 (one for my first step and one for his)
    let santa = orbHash['SAN'];
    let you = orbHash['YOU'];

    let count = -1;
    while(santa) {
        santa.santaTravel = count;
        count++;
        console.log(santa);
        santa = orbHash[santa.directParent];
    }
    count = -1;
    while (you) {
        if (you.santaTravel > 0) {
            console.log(count + you.santaTravel);
            break;
        }
        count++;
        you = orbHash[you.directParent];
    }
});