const fs = require("fs");
function partOne(data, layerSize) {
    const layers = [];
    let min = {
        "0" : Infinity,
        "1" : 0,
        "2" : 0
    };
    for (let i = 0; i < data.length; i+= layerSize) {
        let string = data.slice(i, i+layerSize)
        let layer = {
            string,
            "0" : string.match(/0/g).length,
            "1" : string.match(/1/g).length,
            "2" : string.match(/2/g).length
        };
        layers.push(layer);
        if (layer["0"] < min["0"]) {
            min["0"] = layer["0"];
            min["1"] = layer["1"];
            min["2"] = layer["2"];
        }
    }
    return min["1"]*min["2"];
}

function partTwo (data, rowLength, height) {
    const layerSize = rowLength * height;
    const layers = [];
    for (let i = 0; i < data.length; i+= layerSize) {
        layers.push(data.slice(i, i+layerSize));
    }
    let string = '';
    for (let i = 0; i < layerSize; i++) {
        for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
            let layer = layers[layerIndex];
            if (layer[i] !== "2") {
                string = string + layer[i];
                layerIndex = layers.length + 1;
            }
        }
    }
    // now I need to add line breaks
    let image = '';
    for (let i = 0; i <= string.length; i += rowLength) {
        image = image + string.slice(i, i+rowLength) + require('os').EOL;
    }
    return image;
}
fs.readFile("./puzzle.txt","utf8",function(err,data){
    // 25 x 6 image.
    const rowLength = 25;
    const height = 6;
    console.log(partOne(data, rowLength * height));
    console.log(partTwo(data, rowLength, height));
});
