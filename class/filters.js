const glob = require('glob');
const path = require('path');
const FILTER_DIR = '../filters';

class Filters {
    constructor(){
        this._init();
    }

    _init(){
        const files = glob.sync(path.resolve(path.join(__dirname, FILTER_DIR)) + '/**/*.js');
        for (var i = 0; i < files.length; i++) {
            const fileName = path.basename(files[i].substr(0, (files[i].length - 3)));
            this[fileName] = require(files[i]);
        }
    }
}

if (!global.TemplateEngine) {
   global.TemplateEngine = {};
}
if (!global.TemplateEngine.filters) {
   global.TemplateEngine.filters = new Filters();
}
module.exports = global.TemplateEngine.filters;
