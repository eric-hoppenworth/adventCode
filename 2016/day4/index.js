const fs = require('fs');

fs.readFile('./puzzle.txt','utf8',function(err,data){
    const rooms = data.split('\n');
    rooms.forEach((room)=>{
        let regex = /\-([^-]*)$/;
        let roomCode = room.replace(regex,'');
        let ending = room.match(regex)[1];
        let roomNumber = ending.match(/(\d)*/)[0];
        let checkSum = ending.match(/\[([a-z]*)\]/)[1];

        let counts = {}; //object with keys for each letter present.
        for (let i = 0; i < roomCode.length; i++) {
            let letter = roomCode[i];
            if (letter == '-') {
                continue;
            }
            if (!counts[letter]){
                counts[letter] = 1;
            } else {
                counts[letter]++;
            }
        }
        //need to check counts to see if letters in the checksum are the maximums
        console.log(counts);
    });

});