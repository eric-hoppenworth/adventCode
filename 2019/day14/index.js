const fs = require("fs");
function Reaction (rxn) {
    this.products = rxn[0].map(c=>c.match(/([\d]{1,}) ([A-Z]{1,})/)).map(a=>({name: a[2],amount: parseInt(a[1])}));
    this.reactant = rxn[1].map(c=>c.match(/([\d]{1,}) ([A-Z]{1,})/)).map(a=>({name: a[2],amount: parseInt(a[1])}))[0];
}
Reaction.prototype.decay = function (available) {
    // run the reaction.
    // remove the reactant from the 'produced' list
    // (add the reactant to the 'consumed' list ?)
    // add the products to the produced list.
    // products will only need to be added to the produced list if there are not already enough in the produced list?

    // check to see if my product is already in the available list.
    let result = {...available};
    if (!result[this.reactant.name]) {
        result[this.reactant.name] = 0;
    }
    let multiplier = Math.ceil(result[this.reactant.name]/this.reactant.amount);
    result[this.reactant.name] -= this.reactant.amount * multiplier;
    this.products.forEach((product) => {
        if (!result[product.name]) {
            result[product.name] = 0;
        }
        result[product.name] += product.amount * multiplier;
    });
    return result;
}
fs.readFile("./puzzle.txt","utf8",function(err,data){
    let reactions = data
        .split(require('os').EOL)
        .map(a=>a.split(' => ').map(b=>b.split(', ')))
        .map((rxn) => new Reaction(rxn));

    let reactionsHash = {};
    reactions.forEach(function(rxn){
        reactionsHash[rxn.reactant.name] = rxn;
    });

    let oreCount = 0;

    let maxOre = 1000000000000;
    let nextAvailable = {};
    for (let i = 3848499; i < 3849099; i+=1) {
        let available = {
            'FUEL' : i
        };
        let unfinished = true;
        while (unfinished) {
            nextAvailable = {...available};
            for (key in available) {
                let reaction = reactionsHash[key];
                // console.log("reaction", reaction);
                if (reaction) {
                    while (nextAvailable[key] > 0) {
                        nextAvailable = reaction.decay(nextAvailable);
                        // console.log('running...');
                    }
                }
                // console.log(nextAvailable);
            }
            available = {...nextAvailable};
            // check to see if we are done
            unfinished = false;
            for (key in available) {
                if (key != 'ORE' && available[key] > 0) {
                    unfinished = true;
                }
            }
        }
        // console.log(available);
        console.log(nextAvailable['ORE']);
        if (nextAvailable['ORE'] > maxOre) {
            console.log(i)
            break;
        }
    }
});

