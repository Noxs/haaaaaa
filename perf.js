const fs = require('fs');
const path = require("path");

const template = fs.readFileSync(path.resolve(__dirname, "./test/template/body_with_filter.html.ste")).toString();
const context = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./test/template/parameters_with_filter.1.json")));

const start = Date.now();
const TemplateEngine = require('./lib/templateEngine.js');
const templateEngine = new TemplateEngine();
const filter1 = {
    getName: function () {
        return "testFilter1";
    },
    execute: function (input, param, filterContext) {
        return "Input that has been entered is: " + input;
    }
};

const filter2 = {
    getName: function () {
        return "testFilter2";
    },
    execute: function (input, param, filterContext) {
        return "Input that has been entered is: " + input + " and(input + param) equals " + (input + param);
    }
};

templateEngine.addFilter(filter1);
templateEngine.addFilter(filter2);

templateEngine.render(template, context);

const end = Date.now();
console.log((end - start) / 1000 + " seconds");