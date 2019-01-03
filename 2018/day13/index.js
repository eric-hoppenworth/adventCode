const fs = require("fs");

fs.readFile("./puzzle.txt","utf8",function(err,data){
    const list = data.split(require('os').EOL);
});