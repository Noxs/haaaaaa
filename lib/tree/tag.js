const BadParameterError = require('./badParameterError.js');

const types = { OPEN: "Open", CLOSE: "Close", STANDALONE: "Standalone" };
const categories = { FOR: "For", IF: "If", VAR: "Variable" };
const keywords = { IF: "if", ENDIF: "endif", FOR: "for", ENDFOR: "endfor", SPACER: " ", TAB: "\t", PERCENT: "%" };
const tagDelimiterSize = 2;// this represent the size of {% or {{ delimieter

class Tag {
    constructor(position, content, lineNumber) {
        if (Number.isInteger(position) !== true) {
            throw new BadParameterError("First parameter of constructor must be a number", position);
        }
        if (!content || typeof content !== "string") {
            throw new BadParameterError("Second parameter of constructor must be a string", content);
        }
        if (Number.isInteger(lineNumber) !== true) {
            throw new BadParameterError("Third parameter of constructor must be a number", lineNumber);
        }
        this._position = position;
        this._lineNumber = lineNumber;
        this._type = null;
        this._category = null;
        this._rawContent = content;
        this._content = null;
        this._create();
    }

    _create() {
        if (this.content.startsWith(keywords.FOR + keywords.SPACER) === true) {
            this._setCategoryToFor();
            this._setTypeToOpen();
        } else if (this.content.startsWith(keywords.ENDFOR) === true) {
            this._setCategoryToFor();
            this._setTypeToClose();
        } else if (this.content.startsWith(keywords.IF + keywords.SPACER) === true) {
            this._setCategoryToIf();
            this._setTypeToOpen();
        } else if (this.content.startsWith(keywords.ENDIF) === true) {
            this._setCategoryToIf();
            this._setTypeToClose();
        } else {
            this._setCategoryToVar();
            this._setTypeToStandalone();
        }
    }

    get position() {
        return this._position;
    }

    get lineNumber() {
        return this._lineNumber;
    }

    get type() {
        return this._type;
    }

    get category() {
        return this._category;
    }

    get rawContent() {
        return this._rawContent;
    }

    get content() {
        if (this._content === null) {
            this._content = this._rawContent.substr(tagDelimiterSize, this._rawContent.length - (tagDelimiterSize * 2)).trim();
        }
        return this._content;
    }

    isOpenType() {
        if (this.type === types.OPEN) {
            return true;
        } else {
            return false;
        }
    }

    isCloseType() {
        if (this.type === types.CLOSE) {
            return true;
        } else {
            return false;
        }
    }

    isStandaloneType() {
        if (this.type === types.STANDALONE) {
            return true;
        } else {
            return false;
        }
    }

    _setTypeToOpen() {
        this._type = types.OPEN;
        return this;
    }

    _setTypeToClose() {
        this._type = types.CLOSE;
        return this;
    }

    _setTypeToStandalone() {
        this._type = types.STANDALONE;
        return this;
    }

    isIfCategory() {
        if (this.category === categories.IF) {
            return true;
        } else {
            return false;
        }
    }

    isForCategory() {
        if (this.category === categories.FOR) {
            return true;
        } else {
            return false;
        }
    }

    isVarCategory() {
        if (this.category === categories.VAR) {
            return true;
        } else {
            return false;
        }
    }

    _setCategoryToIf() {
        this._category = categories.IF;
        return this;
    }

    _setCategoryToFor() {
        this._category = categories.FOR;
        return this;
    }

    _setCategoryToVar() {
        this._category = categories.VAR;
        return this;
    }

    isSameCategory(tag) {
        if (this.category === tag.category) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = Tag;
