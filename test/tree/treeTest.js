const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Tree = require('../../lib/tree/tree.js');
const ForNode = require('../../lib/tree/forNode.js');
const Tag = require('../../lib/tree/tag.js');
const Template = require('../../lib/template.js');
const Context = require('../../lib/context.js');
const BadParameterError = require('../../lib/tree/badParameterError.js');
const UsageError = require('../../lib/tree/usageError.js');
const fs = require("fs");
const path = require('path');

describe('Tree', function () {
    it('Tree build() method : success', function () {
        const template = new Template("<h1>This is a test</h1> {% for user in users %} Do things {% endfor %}");
        const context = {};
        const style = "";
        const testFunc = function () {
            const tree = new Tree(template);
        }

        expect(testFunc).to.not.throw();
    });

    it('Tree build() method : failure', function () {
        const testFunc = function () {
            const tree = new Tree("This is not a Template");
        }

        expect(testFunc).to.throw(BadParameterError);
    });

    it('Tree linkNodes() method', function () {
        //TODO previsouNode === null
        //TODO this._currentNode.depth === this._previousNode.depth
        //TODO this._currentNode.depth > this._previousNode.depth
    });

    it('Tree create() method : success with a single node', function () {
        const template = new Template("<h1>This is a test</h1> {% for user in users %} Do things {% endfor %}");
        const context = {};
        const style = "";
        const tree = new Tree(template);

        tree.create();
        assert.equal(tree._start.open.rawContent, "{% for user in users %}");
        assert.equal(tree._start.close.rawContent, "{% endfor %}");
    });

    it('Tree create() method : success with a for loop that has a child', function () {
        const template = new Template("<h1>This is a test</h1> {% for user in users %} Do things {% for email in user.emails %} Do other things {% endfor %} {% endfor%}");
        const context = {};
        const style = "";
        const tree = new Tree(template);

        tree.create();

        assert.deepEqual(tree._start.children[0].parent, tree._start);

        assert.deepEqual(tree._start.open.rawContent, "{% for user in users %}");
        assert.deepEqual(tree._start.open.content, "for user in users");

        assert.deepEqual(tree._start.constructor, ForNode);

        assert.deepEqual(tree._start.open.constructor, Tag);
        assert.deepEqual(tree._start.close.constructor, Tag);

        assert.deepEqual(tree._start.open.rawContent, "{% for user in users %}");
        assert.deepEqual(tree._start.close.rawContent, "{% endfor%}");

        assert.deepEqual(tree._start.open.content, "for user in users");
        assert.deepEqual(tree._start.close.content, "endfor");

        assert.deepEqual(tree._start.template.content, " Do things {% for email in user.emails %} Do other things {% endfor %} ");

        //tree.execute();
    });


    it('Tree create() method : success with two siblings for loops', function () {
        const template = new Template("<h1>This is a test</h1> {% for user in users %} Do things {% endfor %}{% for email in emails %} Do other things {% endfor %}");
        const context = {};
        const style = "";
        const tree = new Tree(template);

        tree.create();

        assert.equal(tree._start.template.content, " Do things ");
        assert.equal(tree._start.next.template.content, " Do other things ");

        assert.deepEqual(tree._start.children, []);
        assert.deepEqual(tree._start.next.children, []);

        assert.equal(tree._start.parent, null);
        assert.equal(tree._start.next.parent, null);
    });

    it('Tree create() method : success with a for loop and two children', function () {
        const template = new Template("<h1>This is a test</h1> {% for user in users %}{% for email in emails %} Do things {% endfor %}{% for key in values %} Do other things {%endfor %} {% endfor%}");
        const context = {};
        const style = "";
        const tree = new Tree(template);

        tree.create();

        assert.deepEqual(tree._start.template.content, "{% for email in emails %} Do things {% endfor %}{% for key in values %} Do other things {%endfor %} ");
        assert.deepEqual(tree._start.next, null);


        assert.deepEqual(tree._start.children.length, 2);
        assert.deepEqual(tree._start.children[0].open.rawContent, "{% for email in emails %}");
        assert.deepEqual(tree._start.children[0].next.open.rawContent, "{% for key in values %}");
        assert.deepEqual(tree._start.children[0].parent.open.rawContent, "{% for user in users %}");

        assert.deepEqual(tree._start.children[1].open.rawContent, "{% for key in values %}");
        assert.deepEqual(tree._start.children[1].parent.open.rawContent, "{% for user in users %}");

        assert.deepEqual(tree._start.parent, null);
    });

    it('Tree create() method : success with three siblings for loops', function () {
        const template = new Template("<h1>This is a test</h1> {% for user in users %} Do things {% endfor %}{% for email in emails %} Do other things {% endfor %}{% for key in values %} Do few more things {% endfor %}");
        const context = {};
        const style = "";
        const tree = new Tree(template);

        tree.create();

        assert.deepEqual(tree._start.next.next.template.content, " Do few more things ");
    });

    it('Tree create() method : success with three siblings for loops and a nested one', function () {
        const template = new Template("<h1>This is a test</h1> {% for user in users %} Do things {% endfor %}{% for email in emails %} Do other things {% endfor %}{% for key in values %} {% for names in key %} {% endfor%}Do few more things {% endfor %}");
        const context = {};
        const style = "";
        const tree = new Tree(template);

        tree.create();

        assert.equal(tree._start.next.next.template.content, " {% for names in key %} {% endfor%}Do few more things ");
        assert.equal(tree._start.next.next.children[0].template.content, " ");
        assert.equal(tree._start.next.next.next, null);
    });

    it('Tree create() method : success with two siblings for loops and a for loop in the first sibling', function () {
        const template = new Template("<h1>This is a test</h1> {% for user in users %} Do things  {% for names in key %} {% endfor%} {% endfor %}{% for email in emails %} Do other things {% endfor %}");
        const context = {};
        const style = "";
        const tree = new Tree(template);

        tree.create();

        assert.equal(tree._start.children[0].template.content, " ");
        assert.equal(tree._start.next.template.content, " Do other things ");
        assert.equal(tree._start.next.next, null);
    });

    it('Tree create() method : success with a if condition in a for', function () {
        const template = new Template("<h1>This is a test</h1> {% for user in users %} {% if user.name %} Do thing {% endif %} {% endfor %}");
        const context = {};
        const style = "";
        const tree = new Tree(template);

        tree.create();

        const IfNode = require("../../lib/tree/ifNode.js");
        assert.equal(tree._start.children[0].constructor, IfNode);
        assert.equal(tree._start.children[0].parent, tree._start);
        assert.equal(tree._start.children[0].template.content, " Do thing ");
    });

    it('Tree create() method : success with a if condition in another if condition', function () {
        const template = new Template("<h1>This is a test</h1> {% if user.name %} Do thing {% if user.age %} Do other things {% endif %} {% endif %}");
        const context = {};
        const style = "";
        const tree = new Tree(template);

        tree.create();

        const IfNode = require("../../lib/tree/ifNode.js");
        assert.deepEqual(tree._start.constructor, IfNode);
        assert.deepEqual(tree._start.children[0].parent, tree._start);
        assert.deepEqual(tree._start.children[0].template.content, " Do other things ");
        assert.deepEqual(tree._start.next, null);
    });

    it('Tree create() method : success with a variable', function () {
        const template = new Template("<h1>This is a test</h1> {{variable}}");
        const context = {};
        const style = "";
        const tree = new Tree(template);

        tree.create();

        assert.equal(tree._start.open.rawContent, "{{variable}}")
    });


    it('Tree create() method : success with a variable nested in a if', function () {
        const template = new Template("<h1>This is a test</h1> {% if variable %} {{ variable }} {% endif %}");
        const context = {};
        const style = "";
        const tree = new Tree(template);

        tree.create();
        assert.equal(tree._start.template.content, " {{ variable }} ");
        assert.equal(tree._start.children[0].open.rawContent, "{{ variable }}");
        assert.equal(tree._start.next, null);
    });

    it('Tree create() method : success with a variable nested in a if two times', function () {
        const template = new Template("<h1>This is a test</h1> {% if variable %} {{ variable }} {% endif %}{% if variable2 %} {{ variable2 }} {% endif %}");
        const context = {};
        const style = "";
        const tree = new Tree(template);

        tree.create();

        assert.equal(tree._start.template.content, " {{ variable }} ");
        assert.equal(tree._start.depth, 0);

        assert.equal(tree._start.children[0].depth, 1);
        assert.equal(tree._start.next.template.content, " {{ variable2 }} ");
        assert.equal(tree._start.next.children[0].open.rawContent, "{{ variable2 }}");
    });

    it('Tree create() method : success with a variable and a if that are siblings', function () {
        const template = new Template("<h1>This is a test</h1> {% if variable %} {% endif %}{{ variable }}");
        const context = {};
        const style = "";
        const tree = new Tree(template);

        tree.create();

        assert.equal(tree._start.template.content, " ");
        assert.equal(tree._start.next.open.rawContent, "{{ variable }}");
    });

    it('Tree create() method : success with a variable and a if, a variable, and another if that are siblings', function () {
        const template = new Template("<h1>This is a test</h1> {% if variable %} {% endif %}{{ variable }} {%if variable %}{% endif%}");
        const context = {};
        const style = "";
        const tree = new Tree(template);

        tree.create();

        assert.equal(tree._start.template.content, " ");
        assert.equal(tree._start.depth, 0);
        assert.equal(tree._start.next.open.rawContent, "{{ variable }}");
        assert.equal(tree._start.next.depth, 0);
        assert.equal(tree._start.next.next.template.content, "");
        assert.equal(tree._start.next.next.depth, 0);
    });


    it('Tree create() method : success with a complex template', function () {
        const template = new Template(fs.readFileSync(path.resolve(__dirname, "./template/body.html.ste")).toString());
        const context = {};
        const style = "";
        const tree = new Tree(template);

        tree.create();
        tree.reset();
        
        let currentNode = tree._start;

        assert.equal(currentNode.template.content.replace(/\s/g, ""), "{% if variables1.length === 1 %}<title>{{ variable }}</title>{% endif %}".replace(/\s/g, ""));
        assert.equal(currentNode.open.line, 7);
        assert.equal(currentNode.children.length, 1);
        assert.equal(currentNode.children[0].isIfCategory(), true);
        assert.equal(currentNode.children[0].open.rawContent, "{% if variables1.length === 1 %}");
        assert.equal(currentNode.children[0].open.line, 8);
        assert.equal(currentNode.children[0].depth, 1);
        assert.equal(currentNode.children[0].children[0].isVarCategory(), true);
        assert.equal(currentNode.children[0].children[0].open.rawContent, "{{ variable }}");
        assert.equal(currentNode.children[0].children[0].open.line, 9);
        assert.equal(currentNode.children[0].children[0].depth, 2);

        currentNode = currentNode.next;

        assert.equal(currentNode.open.rawContent, "{{variable}}");
        assert.equal(currentNode.open.line, 21);
        assert.equal(currentNode.depth, 0);
        currentNode = currentNode.next;

        assert.equal(currentNode.open.rawContent, "{{url}}");
        assert.equal(currentNode.open.line, 38);
        assert.equal(currentNode.depth, 0);
        currentNode = currentNode.next;

        assert.equal(currentNode.template.content.replace(/\s/g, ""), "<div>{{ variable }}</div>".replace(/\s/g, ""));
        assert.equal(currentNode.open.line, 67);
        assert.equal(currentNode.depth, 0);
        assert.equal(currentNode.children[0].open.rawContent, "{{ variable }}");
        assert.equal(currentNode.children[0].open.line, 68);
        assert.equal(currentNode.children[0].depth, 1);

        currentNode = currentNode.next;

        assert.equal(currentNode.template.content.replace(/\s/g, ""), "<div><div>{{ variable }}</div><div>{{ variable }}</div></div><br/>".replace(/\s/g, ""));
        assert.equal(currentNode.open.line, 86);
        assert.equal(currentNode.depth, 0);
        assert.equal(currentNode.children[0].open.rawContent, "{{ variable }}");
        assert.equal(currentNode.children[0].open.line, 89);
        assert.equal(currentNode.children[0].depth, 1);
        assert.equal(currentNode.children[0].next.open.rawContent, "{{ variable }}");
        assert.equal(currentNode.children[0].next.open.line, 92);
        assert.equal(currentNode.children[0].next.depth, 1);
        currentNode = currentNode.next;

        assert.equal(currentNode.open.rawContent, "{{ variable }}");
        assert.equal(currentNode.open.line, 99);
        currentNode = currentNode.next;

        assert.equal(currentNode.open.rawContent, "{{url}}");
        assert.equal(currentNode.open.line, 102);
        currentNode = currentNode.next;

        assert.equal(currentNode.open.rawContent, "{{ url }}");
        assert.equal(currentNode.open.line, 102);
        currentNode = currentNode.next;

        assert.equal(currentNode.open.rawContent, "{{ variable }}");
        assert.equal(currentNode.open.line, 108);
        currentNode = currentNode.next;

        assert.equal(currentNode.open.rawContent, "{{ variable }}");
        assert.equal(currentNode.open.line, 111);
        currentNode = currentNode.next;

        assert.equal(currentNode.open.rawContent, "{{ variable }}");
        assert.equal(currentNode.open.line, 117);
        currentNode = currentNode.next;

        assert.equal(currentNode.open.rawContent, "{{ variable }}");
        assert.equal(currentNode.open.line, 120);
        currentNode = currentNode.next;

        assert.equal(currentNode.template.content.replace(/\s/g, ""), "{{ variable }}".replace(/\s/g, ""));
        assert.equal(currentNode.open.line, 126);
        assert.equal(currentNode.children[0].open.rawContent, "{{ variable }}");
        assert.equal(currentNode.children[0].open.line, 127);
        currentNode = currentNode.next;

        assert.equal(currentNode.template.content.replace(/\s/g, ""), "<a>{{ variable.key }}</a><br/>".replace(/\s/g, ""));
        assert.equal(currentNode.open.line, 130);
        assert.equal(currentNode.children[0].open.rawContent, "{{ variable.key }}");
        assert.equal(currentNode.children[0].open.line, 132);
        currentNode = currentNode.next;

        assert.equal(currentNode.template.content.replace(/\s/g, ""), "<table><tbody><tr><td><table><tbody><tr><td><table><tbody><tr><td><a href=\"https:\/\/{{url}}\" target=\"_blank\"><img src=\"https:\/\/{{ url }}\" alt=\"\"></a></td></tr></tbody></table><div><span>{{ variable }}</span></div></td></tr></tbody></table></td></tr></tbody></table>".replace(/\s/g, ""));
        assert.equal(currentNode.open.line, 149);
        assert.equal(currentNode.children[0].open.rawContent, "{{url}}");
        assert.equal(currentNode.children[0].open.line, 162);
        assert.equal(currentNode.children[1].open.rawContent, "{{ url }}");
        assert.equal(currentNode.children[1].open.line, 163);
        assert.equal(currentNode.children[2].open.rawContent, "{{ variable }}");
        assert.equal(currentNode.children[2].open.line, 170);
        currentNode = currentNode.next;
    });

    it('Tree create() method : failure with LogicError', function () {
        //TODO  call create() with template with no tag as parameter, and set the depth nodeFactory property to 1, it should throw a LogicError
    });


    it('Tree execute() method: execute a template', function () {
        // TODO
    });

    it('Tree execute() method: failure when called before create()', function () {
        const template = new Template("<h1>This is a test</h1> {% if variable %}  {% endif %}{{ variable }} {%if variable %}{% endif%}");
        const context = {};
        const style = "";
        const tree = new Tree(template);

        const testBadParameter = function () {
            tree.execute("This is not a Context");
        };
        expect(testBadParameter).to.throw(BadParameterError);

        const testExecuteBeforeCreate = function () {
            tree.execute(new Context({}));
        };
        expect(testExecuteBeforeCreate).to.throw(UsageError);
    });
});
