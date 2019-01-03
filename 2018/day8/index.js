const fs = require("fs");
var pos = 0;
let metaDataTotal = 0

function Node(childCount, metaCount) {
    this.numberOfChildren = childCount;
    this.numberOfMetaData = metaCount;
    this.children = [];
    this.metaData = [];
}
Node.prototype.assignChild = function(node) {
    this.children.push(node);
}
Node.prototype.assignData = function(data) {
    this.metaData.push(parseInt(data,10));
    metaDataTotal += parseInt(data,10);
}
Node.prototype.needsMoreChildren = function() {
    return this.children.length < this.numberOfChildren;
}
Node.prototype.needsMoreData = function() {
    return this.metaData.length < this.numberOfMetaData;
}
Node.prototype.manageChildren = function(list) {
    if (this.needsMoreChildren()) {
        for (let i = 0; i < this.numberOfChildren; i++) {
            let newChild = new Node(list[pos++],list[pos++]);
            this.assignChild(newChild);
            newChild.manageChildren(list,pos);
        }
    }

    if (this.needsMoreData()) {
        for (let i = 0; i < this.numberOfMetaData; i++) {
            this.assignData(list[pos++]);
        }
    }
}
Node.prototype.getValue = function() {
    let value = 0;
    if (this.children.length) {
        //this node has children, so I have to add all of its children's values.
        for (let i = 0; i < this.metaData.length ; i++) {
            let index = this.metaData[i] - 1;
            if (index < 0 || index > (this.children.length - 1)) {
                //skip this entry
            } else {
                value += this.children[index].getValue();
            }
        }
    } else {
        //this node does not have children so I have to add all of it's metda data
        for (let i = 0; i < this.metaData.length; i++) {
            value += this.metaData[i];
        }
    }
    return value;
}



fs.readFile("./puzzle.txt","utf8",function(err,data){
    const list = data.split(" ");
    let rootNode = new Node(list[pos++], list[pos++]);
    rootNode.manageChildren(list);
    // fs.writeFileSync("./root.json",JSON.stringify(rootNode,null,2));
    // console.log(rootNode);
    console.log(metaDataTotal);
    console.log(rootNode.getValue());
});