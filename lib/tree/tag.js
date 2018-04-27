const constants = require("./constants.js");
class Tag {
    constructor(position, content, lineNumber){
        if (position === null || position === undefined || typeof position !== "number") {
            throw new Error("First parameter of constructor must be a number, " + typeof position + " given");
        }
        if (!content || typeof content !== "string") {
            throw new Error("Second parameter of constructor must be a string, " + typeof content + " given");
        }
        if (lineNumber === null || lineNumber === undefined || typeof lineNumber !== "number") {
            throw new Error("Third parameter of constructor must be a number, " + typeof lineNumber + " given");
        }
        this._position = position;
        this._lineNumber = lineNumber;
        this._type = null;
        this._category = null;
        this._rawContent = content;
        this._content = content;
        this._create();
    }

    _create(){
        this._content = this._rawContent.substr(2, this._rawContent.length-4).trim();
        let i = 0;
        while (this._content[i+1]) {
            if (this._content[i] === "\\s" || this._content[i] === "\\t") {
                i++;
                while (this._content[i] === "\\s" || this._content[i] === "\\t"){
                    i++;
                }
            } else if (this._content.substr(i, 4) === "for " && this._content[i-1] !== "d"){
                this._category = constants.categories.FOR;
                this._type = constants.types.OPEN;
                return;
            } else if (this._content.substr(i, 6) === "endfor"){
                this._category = constants.categories.FOR;
                this._type = constants.types.CLOSE;
                return;
            } else if (this._content.substr(i, 3) === "if " && this._content[i-1] !== "d"){
                this._category = constants.categories.IF;
                this._type = constants.types.OPEN;
                return;
            } else if (this._content.substr(i, 5) === "endif"){
                this._category = constants.categories.IF;
                this._type = constants.types.CLOSE;
                return;
            } else {
                this._category = constants.categories.VARIABLE;
                this._type = constants.types.STANDALONE;
            }
            i++;
        }
    }

    get position (){
        return this._position;
    }

    get lineNumber(){
        return this._lineNumber;
    }

    get type (){
        return this._type;
    }

    get category (){
        return this._category;
    }

    get rawContent(){
        return this._rawContent;
    }

    get content (){
        return this._content;
    }
}

module.exports = Tag;
