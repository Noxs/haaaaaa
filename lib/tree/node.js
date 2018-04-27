const Tag = require("./tag.js");
const constants = require('./constants.js');
class Node {
    constructor(){
        this._open = null;
        this._close = null;

        this._depth = null;

        this._next = null;
        this._parent = null;
        this._children = [];

        this._category = null;
        this._content = null;
    }

    complete(tag, template){
        if (tag.constructor !== Tag) {
            throw new Error("First parameter of complete() method must be a Tag object, " + typeof tag + " given");
        }
        if (typeof template !== "string") {
            throw new Error("Second parameter of complete() method must be a string, " + typeof template + " given");
        }
        if(this._close){
            throw new Error("Node is already completed");
        }
        if (this.category !== tag.category) {
            throw new Error("Tried to complete a " + this.category + " node with a " + tag.category + " tag");
        }

        this._close = tag;
        this._content = template.substring(this._open.position, this._close.position + this._close.rawContent.length);
    }

    get open(){
        return this._open;
    }

    set open(tag){
        if (tag.constructor !== Tag) {
            throw new Error("Cannot set node.open property, must be a Tag object, " + typeof tag + " given");
        }
        this._open = tag;
    }

    get close(){
        return this._close;
    }

    isClosed(){
        if (this._close || this.open.type === constants.types.STANDALONE) {
            return true;
        } else {
            return false;
        }
    }

    get depth(){
        return this._depth;
    }

    set depth(depth){
        this._depth = depth;
    }

    get next(){
        return this._next;
    }
    addNext(node){
        this._next = node;
        if (this._parent) {
            this._parent._addChild(node);
            node._addParent(this.parent);
        }
    }

    get parent(){
        return this._parent;
    }
    _addParent(node){
        this._parent = node;
    }
    addParent(node){
        this._parent = node;
        if (this._children.length > 0) {
            this._children[this._children.length-1].addNext(node);
        }
        node._addChild(this);
    }

    get children(){
        return this._children;
    }
    _addChild(node){
        this._children.push(node);
    }

    get content(){
        return this._content;
    }

    get category(){
        return this._category;
    }
    set category(category){
        this._category = category;
    }
}


module.exports = Node;
