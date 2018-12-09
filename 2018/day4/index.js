const fs = require("fs");

function Shift(string) {
    let splitString = string.split("] ");
    let time = splitString[0].replace("[","");
    this.action = splitString[1];
    this.date = new Date(time);
}
function Guard(id) {
    this.shifts = [];
    this.id = id;
    this.previousShift = null;
    this.minutesSlept = 0;
    this.minuteCount = {};
}
Guard.prototype.doAction = function(shift) {
    switch (shift.action) {
        case "wakes up":
            this.minutesSlept += shift.date.getMinutes() - this.previousShift.date.getMinutes(); //this should be fine since I don't cross hours
            let start = this.previousShift.date.getMinutes();
            let end = shift.date.getMinutes(); //according to rules, the guard wakes up on the minute
            for(let i = start; i < end; i++) {
                if (!this.minuteCount[i]) {
                    this.minuteCount[i] = 1;
                } else {
                    this.minuteCount[i]++;
                }
            }
    }
    this.previousShift = shift;
};
Guard.prototype.sleepiestMinute = function(){
    let max = 0;
    let minute = 0;
    for (let myMinute in this.minuteCount) {
        if (this.minuteCount[myMinute] > max) {
            max = this.minuteCount[myMinute];
            minute = myMinute;
        }
    }
    return {
        max,
        minute
    };
};

fs.readFile("./puzzle.txt","utf8",function(err,data){
    const list = data.split(require('os').EOL);
    const shifts = [];
    const guards = {};
    list.forEach(function(elem){
        shifts.push(new Shift(elem));
    });
    shifts.sort(function(a,b){
        return a.date.getTime() - b.date.getTime();
    });

    //apply shifts to the correct guard
    let activeGuard = {};
    shifts.forEach(function(shift){
        if (shift.action.match(/Guard/)) {
            //this means that I need to switch guards
            let id = shift.action.match(/#(\d*)\s/)[1];
            //see if he has been on shift before, or create a new one
            if (!guards[id]) {
                guards[id] = new Guard(id);
            }
            activeGuard = guards[id];
        }
        activeGuard.shifts.push(shift);
    });

    //do the shifts
    //part one
    let maxMinutes = 0;
    let sleepiestOne = null;
    //part two
    let mostSleptMinutes = 0;
    let sleepiestTwo = null;

    for (let id in guards) {
        const myGuard = guards[id];
        myGuard.shifts.forEach(function(shift){
            myGuard.doAction(shift);
        });
        //part one
        if (myGuard.minutesSlept > maxMinutes) {
            maxMinutes = myGuard.minutesSlept;
            sleepiestOne = myGuard;
        }
        //part two
        if (myGuard.sleepiestMinute().max > mostSleptMinutes) {
            mostSleptMinutes = myGuard.sleepiestMinute().max;
            sleepiestTwo = myGuard;
        }

    }

    //part one
    console.log(sleepiestOne.id * sleepiestOne.sleepiestMinute().minute);
    console.log(sleepiestTwo.id * sleepiestTwo.sleepiestMinute().minute);

    //at this point, each guard has a list of shifts that belong to him/her
});