const BadParameterError = require('./badParameterError.js');

const types = {
    OPEN: "Open",
    CLOSE: "Close",
    STANDALONE: "Standalone",
    MIDDLE: "Middle",
};
const categories = {
    FOR: "For",
    IF: "If",
    ELSE: "Else",
    ELSEIF: "Elseif",
    VAR: "Variable",
    STYLE: "Style"
};
const keywords = {
    IF: "if",
    ELSE: "else",
    ELSEIF: "elseif",
    ENDIF: "endif",
    FOR: "for",
    ENDFOR: "endfor",
    STYLE: "style",
    SPACER: " ",
    TAB: "\t",
    PERCENT: "%"
};
const tagDelimiterSize = 2;

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
        } else if (this.content.startsWith(keywords.ELSEIF + keywords.SPACER) === true) {
            this._setCategoryToElseif();
            this._setTypeToMiddle();
        } else if (this.content.startsWith(keywords.IF + keywords.SPACER) === true) {
            this._setCategoryToIf();
            this._setTypeToOpen();
        } else if (this.content.startsWith(keywords.ENDIF) === true) {
            this._setCategoryToIf();
            this._setTypeToClose();
        } else if (this.content.startsWith(keywords.STYLE) === true) {
            this._setCategoryToStyle();
            this._setTypeToStandalone();
        } else if (this.content.startsWith(keywords.ELSE) === true) {
            this._setCategoryToElse();
            this._setTypeToMiddle();
        } else {
            this._setCategoryToVar();
            this._setTypeToStandalone();
        }
        this.cleanContent();
        return this;
    }

    cleanContent() {
        this._content = this._content.trim();
    }

    get start() {
        return this.position;
    }

    get end() {
        return this.position + this.rawContent.length;
    }

    get position() {
        return this._position;
    }

    get line() {
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
            this._content = this._rawContent.substr(tagDelimiterSize, this._rawContent.length - (tagDelimiterSize * 2));
            let i = 0;
            while (this._content[i] === " " && i < this._content.length) {
                i++;
            }
            this._content = this._content.substr(i, this._content.length);
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

    isMiddleType() {
        if (this.type === types.MIDDLE) {
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

    _setTypeToMiddle() {
        this._type = types.MIDDLE;
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

    isStyleCategory() {
        if (this.category === categories.STYLE) {
            return true;
        } else {
            return false;
        }
    }

    isElseCategory() {
        if (this.category === categories.ELSE) {
            return true;
        } else {
            return false;
        }
    }

    isElseifCategory() {
        if (this.category === categories.ELSEIF) {
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

    _setCategoryToStyle() {
        this._category = categories.STYLE;
        return this;
    }

    _setCategoryToElse() {
        this._category = categories.ELSE;
        return this;
    }

    _setCategoryToElseif() {
        this._category = categories.ELSEIF;
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