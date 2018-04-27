const constants = require("./constants.js");
const NodeFactory = require('./nodeFactory.js');
const Tag = require('./tag.js');
const Template = require('../template.js');

class Tree {
    constructor(template){
        if(!template || template.constructor !== Template){
            throw new Error("First parameter of Tree constructor must be a string, " + typeof template + " given");
        }
        this._template = template;
        this._lineNumber = 1;
        this._previousNode = null;
        this._currentNode = null;
        this._start = null;
        this._nodeFactory = new NodeFactory();
    }

    _browseToNext(node){
        if (node.children.length > 0) {
            node = node.children[0];
            return node;
        } else if (node.next) {
            node = node.next;
            return node;
        } else if (node.parent) {
            node = node.parent.next;
            return node;
        } else {
            return null;
        }
    }

    browse(){
        let currentNode = null;
        if(!this._start){
            return;
        }
        currentNode = this._start;
        while(currentNode){
            currentNode = this._browseToNext(currentNode);
        }
    }

    linkNodes(){
        if (this._previousNode !== null) {
            if (this._currentNode.depth === this._previousNode.depth) {
                this._previousNode.addNext(this._currentNode);
            } else if (this._currentNode.depth > this._previousNode.depth) {
                this._currentNode.addParent(this._previousNode);
            }
        }
    }

    create(){
        let depth = 0, i = 0;
        while (this._template._content[i+1]) {
            const rawTag = this._template.searchNextTag(i);
            if (rawTag === null) {
                return;
            }
            const tag = new Tag(rawTag.position, rawTag.content, rawTag.lineNumber);
            if (tag.type === constants.types.OPEN) {
                this._currentNode = this._nodeFactory.create(tag, depth, this._lineNumber);
                this.linkNodes();
                depth++;
            } else if (tag.type === constants.types.CLOSE){
                depth--;
                if (this._previousNode.isClosed()) {
                    this._currentNode = this._previousNode.parent;
                } else {
                    this._currentNode = this._previousNode;
                }
                this._currentNode.complete(tag, this._template._content);
            } else if (tag.type === constants.types.STANDALONE){
                this._currentNode = this._nodeFactory.create(tag, depth, this._lineNumber);
                this.linkNodes();
            }
            if (this._start === null) {
                this._start = this._currentNode;
            }
            this._previousNode = this._currentNode;
            i = rawTag.position + rawTag.content.length;
        }
        if (depth !== 0) {
            throw new Error("One tag is missing");
        }
        return this;
    }
}


module.exports = Tree;
