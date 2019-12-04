const fs = require("fs");

function Wire (path, id) {
    this.path = path;
    this.id = id;
}

fs.readFile("./puzzle.txt","utf8",function(err,data){

    data = data.split(require('os').EOL);
    const wires = [];
    data.forEach(function(path. index){
        wires.push(new Wire(path.split(','), index));
    });
    console.log(wires);
});