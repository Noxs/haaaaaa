const Node = require('./node.js');
const Template = require('./template.js');
const TemplateError = require('./templateError.js');
const UsageError = require('./usageError.js');

class StyleNode extends Node {
    constructor(tag, depth) {
        super(tag, depth);
        if (depth > 0) {
            throw new TemplateError("Style must not be in another block", tag.line);
        }
    }

    preExecute() {
        this._fetchContext();
        this._fetchFilters();
        this.preExecutionDone();
        return this;
    }

    postExecute() {
        if (!this.context.getStyle) {
            throw new UsageError("Style is missing as TemplateEngine render() parameter");
        }
        this.result = new Template(this.context.getStyle());

        this.postExecutionDone();
        if (this.hasNext()) {
            return this.getNext();
        } else {
            return null;
        }
    }
}

module.exports = StyleNode;