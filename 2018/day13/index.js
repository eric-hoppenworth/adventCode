const fs = require("fs");
const startingDirections = {
    '<' : 'WEST',
    '^' : 'NORTH',
    '>' : 'EAST',
    'v' : 'SOUTH'
};
const paths = {
    '/' : {
        'NORTH': 'EAST',
        'SOUTH' : 'WEST',
        'EAST' : 'NORTH',
        'WEST' : 'SOUTH'
    },
    'x': { //replaced the '\' character
        'NORTH': 'WEST',
        'SOUTH' : 'EAST',
        'EAST' : 'SOUTH',
        'WEST' : 'NORTH'
    },
    "-": {
        'EAST' : 'EAST',
        'WEST' : 'WEST'
    },
    "|": {
        'NORTH' : 'NORTH',
        'SOUTH' : 'SOUTH'
    },
    "+":{
        'NORTH': {
            'LEFT': 'WEST',
            'RIGHT': 'EAST',
            'STRAIGHT': 'NORTH',
        },
        'EAST': {
            'LEFT': 'NORTH',
            'RIGHT': 'SOUTH',
            'STRAIGHT': 'EAST',
        },
        'SOUTH': {
            'LEFT': 'EAST',
            'RIGHT': 'WEST',
            'STRAIGHT': 'SOUTH',
        },
        'WEST': {
            'LEFT': 'SOUTH',
            'RIGHT': 'NORTH',
            'STRAIGHT': 'WEST',
        }
    }
};
const turns = [
    'LEFT',
    'STRAIGHT',
    'RIGHT'
];
const vectors = {
    'NORTH': {
        x: 0,
        y: -1
    },
    'SOUTH': {
        x: 0,
        y: 1
    },
    'EAST': {
        x: 1,
        y: 0
    },
    'WEST': {
        x: -1,
        y: 0
    }
};

function Cart(x,y,direction,id) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.turns = -1;
    this.board = null;
    this.id = id;
    this.removed = false;
    this.previousLocation = {};
}
Cart.prototype.move = function() {
    //move on space forward in the direction you are facing
    let vector = vectors[this.direction];
    this.previousLocation = {
        x: this.x,
        y: this.y
    };
    this.x += vector.x;
    this.y += vector.y;

};
Cart.prototype.turn = function() {
    //check the space you are standing on and change your direction if needed
    const space = this.board[this.y][this.x];
    let newDirection = '';
    if (space == '+') {
        this.turns++;
        this.turns = this.turns % turns.length;
        let turnDirection = turns[this.turns];
        newDirection = paths[space][this.direction][turnDirection];
    } else {
        newDirection = paths[space][this.direction];
    }
    this.direction = newDirection;
};
Cart.prototype.assignBoard = function(board) {
    this.board = board;
};
Cart.prototype.getLocation = function() {
    return {
        x: this.x,
        y: this.y,
        direction: this.direction
    };
};
Cart.prototype.checkCollision = function (carts) {
    for(let i = 0; i < carts.length; i++){
        let cart = carts[i]
        if (cart !== this && !cart.removed) {
            if (this.x == cart.x && this.y == cart.y) {
                cart.removed = true;
                return true;
            }
        }
    }
    return false;
};
Cart.prototype.handleTick = function(carts) {
    this.move();
    let collision = this.checkCollision(carts);
    if (collision) {
        console.log('hit!');
        console.log(this.getLocation());
        this.removed = true;
    }
    this.turn();
};

function cartsRemaining(carts){
    let count = 0;
    carts.forEach(function(cart){
        if (!cart.removed) {
            count++;
        }
    });
    return count;
}

//sort the carts array so that they are in the correct order
function sortCarts(a,b) {
    if (a.y < b.y) {
        return -1;
    } else if (b.y < a.y) {
        return 1;
    } else if (a.y = b.y) {
        if (a.x < b.x) {
            return -1;
        } else {
            return 1;
        }
    }
}

// I did not like the fact that the '\' character wanted to be escaped.  So I changed all '\' from the original input to 'x'.
fs.readFile("./puzzle.txt","utf8",function(err,data){
    const list = data.split(require('os').EOL);
    const carts = [];
    const board = [];
    let cartCount = 0;
    for (let row = 0; row < list.length; row++) {
        board.push([]);
        for (let col = 0; col < list[row].length; col++) {
            if (startingDirections[list[row][col]]) {
                carts.push(new Cart(col,row,startingDirections[list[row][col]],cartCount));
                cartCount++;
                if (startingDirections[list[row][col]] == 'NORTH' || startingDirections[list[row][col]] == 'SOUTH') {
                    board[row].push("|");
                } else {
                    board[row].push("-");
                }
            } else {
                board[row].push(list[row][col]);
            }
        }
    }
    carts.forEach(function(cart){
        cart.assignBoard(board);
    });
    carts.sort(sortCarts);
    for (let i = 1; cartsRemaining(carts) != 1; i++) {
        carts.forEach(function(cart){
            if (!cart.removed) {
                cart.handleTick(carts);
            }
        });
        carts.sort(sortCarts);
    }
    carts.forEach(function(cart){
        if (!cart.removed) {
            console.log(cart.getLocation());
            console.log(cart.previousLocation);

        }
    });

});