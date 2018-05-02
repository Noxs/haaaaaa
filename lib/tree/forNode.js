const Node = require('./node.js');

class ForNode extends Node {
    constructor(tag, depth) {
        super(tag, depth);
    }

    _extractForFromString(string) { //?????
        // returns {key : string, value : string}
    }

    preExecute() {

    }

    postExecute() {

    }
}


module.exports = ForNode;
