const min = 248345;
const max = 746315;

// rules:
/*
    1. never decreasing
    2. must contain atleast one adjacent pair
*/
const passwords = [];
for (let check = min; check <= max ; check++) {
    const string = check.toString();
    let neverDecreasing = true;
    let containsPair = false;
    let length = (string.length - 1);
    let groupLength = 1;
    for (let i = 0; i < length; i++) {
        const a = parseInt(string[i]);
        const b = parseInt(string[i+1]);
        if (a === b) {
            groupLength++;
        } else {
            if (groupLength == 2) {
                containsPair = true;
            }
            groupLength = 1;
        }

        if (i+1 == length && groupLength == 2) {
            containsPair = true;
        }

        if (a > b) {
            neverDecreasing = false;
        }
    }
    if (neverDecreasing && containsPair) {
        passwords.push(check);
    }
}

passwords.forEach(a=> console.log(a));
console.log(passwords.length);