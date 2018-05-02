const Node = require('./node.js');

class VariableNode extends Node {
    constructor(tag, depth) {
        super(tag, depth);
        //TODO initialize result
    }

    extractVarName() {

    }

    /*extractVarName() {// rename

    }*/

    preExecute() {
        this._fetchContext();
        //return next node to preExecute
        this.preExecutionDone();
        if (this.hasChildren() === true) {
            return this.getFirstChildren();
        } else {
            return this;
        }
    }

    postExecute() {

        //extract only variable
        //eval
        //check filter
        //if filter then execute
        //store result
        //return next node to preExecute
        /*
        /*process(template, context) {
            return new Promise((resolve, reject) => {*/


        //const list = template.search(this._regexp);
        //const promises = [];
        //for (let i = 0; i < list.length; i++) {
        const varName = this.extractVarName();
        const code = context.stringify(context) + varName;
        //code += list[i][1];
        //let variable;
        try {
            const variable = eval(code);
            if (variable === undefined) {
                const error = new Error(list[i][1] + " is undefined");
                error.steUndefinedValue = true;
                throw new Error(); //TODO
                //return reject(error);
            }
            if ((Array.isArray(variable) && variable.length === 0) || typeof variable === "boolean" || variable === null) {
                const error = new Error(list[i][1] + " is not printable, type : " + typeof variable); //rework create specific error
                error.steNotPrintableValue = true;
                throw new Error(); //TODO
                //return reject(error);
            }
        } catch (error) {
            if (error.message === list[i][1] + " is not defined") { //rework create specific error 
                error.steMissingParameter = true;
            }
            throw new Error(); //TODO
            //return reject(error);
        }

        if (this.haveFilters() === true) {
            //TODO apply filters
            this._filters.applyFilter(list[i], variable, context);
        }
        this.postExecutionDone();
        if (this.hasNext()) {
            return this.getNext();
        } else if (this.hasParent()) {
            return this.getParent();
        } else {
            return null;
        }
    }
}

module.exports = VariableNode;
