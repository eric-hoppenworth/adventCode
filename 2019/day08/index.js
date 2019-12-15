const fs = require("fs");

fs.readFile("./puzzle.txt","utf8",function(err,data){
    console.log(data.length);
});
