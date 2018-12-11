const fs = require("fs");
let regex = /Step (.) must be finished before step (.) can begin\./

function Command(requiredStep, laterStep) {
    this.requiredStep = requiredStep;
    this.laterStep = laterStep;
}
Command.prototype.assignSteps = function (steps) {
    steps[this.laterStep].addStep(steps[this.requiredStep]);
}

function Step(name, timeBonus) {
    this.name = name;
    this.requiredSteps = [];
    this.completed = false;
    this.requiredTime = 60 + timeBonus;
    this.isStarted = false;

}
Step.prototype.addStep = function(otherStep) {
    this.requiredSteps.push(otherStep);
}
Step.prototype.canBeCompleted = function() {
    if (this.completed) {
        return false;
    }
    if (!this.requiredSteps.length) {
        return true;
    }
    for (let i = 0; i < this.requiredSteps.length; i++) {
        if (this.requiredSteps[i].completed == false) {
            return false;
        }
    }
    return true;
}
Step.prototype.complete = function () {
    this.completed = true;
    return this.name;
};

function Worker(id) {
    this.stepBeingCompleted = null;
    this.timeSpent = 0;
    this.id = id;
}
Worker.prototype.startStep = function (step) {
    this.stepBeingCompleted = step;
    step.isStarted = true;
}
Worker.prototype.work = function() {
    if (this.stepBeingCompleted) {
        this.timeSpent++;
        if (this.timeSpent >= this.stepBeingCompleted.requiredTime) {
            this.stepBeingCompleted.complete();
            this.stepBeingCompleted = null;
            this.timeSpent = 0;
        }
    }
}

function allStepsComplete(steps) {
    for (let key in steps) {
        if (!steps[key].completed) {
            return false;
        }
    }
    return true;
}

function firstAvailableStep(steps) {
    for (let key in steps) {
        if (steps[key].canBeCompleted() && !steps[key].isStarted) {
            return steps[key];
        }
    }
    return null;
}

function firstAvailableWorker(workers) {
    for (let i = 0; i < workers.length; i++) {
        if (!workers[i].stepBeingCompleted) {
            return workers[i];
        }
    }
    return null;
}

fs.readFile("./puzzle.txt","utf8",function(err,data){
    const list = data.split(require('os').EOL);

    const steps = {};
    const partTwoSteps = {};
    for (let i = 97; i < 123; i++) {
        let letter = String.fromCharCode(i).toUpperCase();
        steps[letter] = new Step(letter, i-96);
        partTwoSteps[letter] = new Step(letter, i-96);
    }

    list.forEach(function(string){
        let [notImportant, match1, match2] = string.match(regex);
        const command = new Command(match1, match2);
        command.assignSteps(steps);
        command.assignSteps(partTwoSteps);
    });

    //part 1
    let listOrder = '';
    while (!allStepsComplete(steps)) {
        for (let key in steps) {
            const myStep = steps[key];
            if (myStep.canBeCompleted()) {
                listOrder += myStep.complete();
                break;
            }
        }
    }
    console.log(listOrder);

    //part 2
    const workers = [];
    for (let i = 0; i < 5; i++) {
        workers.push(new Worker(i));
    }

    let elapsedSeconds = 0;
    while(!allStepsComplete(partTwoSteps)) {
        while (firstAvailableStep(partTwoSteps) && firstAvailableWorker(workers)) {
            let step = firstAvailableStep(partTwoSteps);
            let worker = firstAvailableWorker(workers);
            worker.startStep(step);
        }
        workers.forEach(function(worker){
            worker.work();
        });
        elapsedSeconds++;
    }
    console.log(workers);
    console.log(elapsedSeconds);
});