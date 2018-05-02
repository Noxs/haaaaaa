const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Tree = require('../../lib/tree/tree.js');
const ForNode = require('../../lib/tree/forNode.js');
const Tag = require('../../lib/tree/tag.js');
const Template = require('../../lib/template.js');
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

        assert.deepEqual(tree._start.template.content, "{% for user in users %} Do things {% for email in user.emails %} Do other things {% endfor %} {% endfor%}");

        //tree.execute();
    });


    it('Tree create() method : success with two siblings for loops', function () {
        const template = new Template("<h1>This is a test</h1> {% for user in users %} Do things {% endfor %}{% for email in emails %} Do other things {% endfor %}");
        const context = {};
        const style = "";
        const tree = new Tree(template);

        tree.create();

        assert.deepEqual(tree._start.template.content, "{% for user in users %} Do things {% endfor %}");
        assert.deepEqual(tree._start.next.template.content, "{% for email in emails %} Do other things {% endfor %}");

        assert.deepEqual(tree._start.children, []);
        assert.deepEqual(tree._start.next.children, []);

        assert.deepEqual(tree._start.parent, null);
        assert.deepEqual(tree._start.next.parent, null);
    });

    it('Tree create() method : success with a for loop and two children', function () {
        const template = new Template("<h1>This is a test</h1> {% for user in users %}{% for email in emails %} Do things {% endfor %}{% for key in values %} Do other things {%endfor %} {% endfor%}");
        const context = {};
        const style = "";
        const tree = new Tree(template);

        tree.create();

        assert.deepEqual(tree._start.template.content, "{% for user in users %}{% for email in emails %} Do things {% endfor %}{% for key in values %} Do other things {%endfor %} {% endfor%}");
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

        assert.deepEqual(tree._start.next.next.template.content, "{% for key in values %} Do few more things {% endfor %}");
    });

    it('Tree create() method : success with three siblings for loops and a nested one', function () {
        const template = new Template("<h1>This is a test</h1> {% for user in users %} Do things {% endfor %}{% for email in emails %} Do other things {% endfor %}{% for key in values %} {% for names in key %} {% endfor%}Do few more things {% endfor %}");
        const context = {};
        const style = "";
        const tree = new Tree(template);

        tree.create();

        assert.deepEqual(tree._start.next.next.template.content, "{% for key in values %} {% for names in key %} {% endfor%}Do few more things {% endfor %}");
        assert.deepEqual(tree._start.next.next.children[0].template.content, "{% for names in key %} {% endfor%}");
        assert.deepEqual(tree._start.next.next.next, null);
    });

    it('Tree create() method : success with two siblings for loops and a for loop in the first sibling', function () {
        const template = new Template("<h1>This is a test</h1> {% for user in users %} Do things  {% for names in key %} {% endfor%} {% endfor %}{% for email in emails %} Do other things {% endfor %}");
        const context = {};
        const style = "";
        const tree = new Tree(template);

        tree.create();

        assert.deepEqual(tree._start.children[0].template.content, "{% for names in key %} {% endfor%}");
        assert.deepEqual(tree._start.next.template.content, "{% for email in emails %} Do other things {% endfor %}");
        assert.deepEqual(tree._start.next.next, null);
    });

    it('Tree create() method : success with a if condition in a for', function () {
        const template = new Template("<h1>This is a test</h1> {% for user in users %} {% if user.name %} Do thing {% endif %} {% endfor %}");
        const context = {};
        const style = "";
        const tree = new Tree(template);

        tree.create();

        const IfNode = require("../../lib/tree/ifNode.js");
        assert.deepEqual(tree._start.children[0].constructor, IfNode);
        assert.deepEqual(tree._start.children[0].parent, tree._start);
        assert.deepEqual(tree._start.children[0].template.content, "{% if user.name %} Do thing {% endif %}");
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
        assert.deepEqual(tree._start.children[0].template.content, "{% if user.age %} Do other things {% endif %}");
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
        assert.equal(tree._start.template.content, "{% if variable %} {{ variable }} {% endif %}");
        assert.equal(tree._start.children[0].open.rawContent, "{{ variable }}");
        assert.equal(tree._start.next, null);
    });

    it('Tree create() method : success with a variable nested in a if two times', function () {
        const template = new Template("<h1>This is a test</h1> {% if variable %} {{ variable }} {% endif %}{% if variable2 %} {{ variable2 }} {% endif %}");
        const context = {};
        const style = "";
        const tree = new Tree(template);

        tree.create();

        assert.equal(tree._start.template.content, "{% if variable %} {{ variable }} {% endif %}");
        assert.equal(tree._start.depth, 0);

        assert.equal(tree._start.children[0].depth, 1);
        assert.equal(tree._start.next.template.content, "{% if variable2 %} {{ variable2 }} {% endif %}");
        assert.equal(tree._start.next.children[0].open.rawContent, "{{ variable2 }}");
    });

    it('Tree create() method : success with a variable and a if that are siblings', function () {
        const template = new Template("<h1>This is a test</h1> {% if variable %}  {% endif %}{{ variable }}");
        const context = {};
        const style = "";
        const tree = new Tree(template);

        tree.create();

        assert.equal(tree._start.template.content, "{% if variable %}  {% endif %}");
        assert.equal(tree._start.next.open.rawContent, "{{ variable }}");
        assert.equal(tree._start.next.open.rawContent, "{{ variable }}");
    });

    it('Tree create() method : success with a variable and a if, a variable, and another if that are siblings', function () {
        const template = new Template("<h1>This is a test</h1> {% if variable %}  {% endif %}{{ variable }} {%if variable %}{% endif%}");
        const context = {};
        const style = "";
        const tree = new Tree(template);

        tree.create();

        assert.equal(tree._start.template.content, "{% if variable %}  {% endif %}");
        assert.equal(tree._start.depth, 0);
        assert.equal(tree._start.next.open.rawContent, "{{ variable }}");
        assert.equal(tree._start.next.depth, 0);
        assert.equal(tree._start.next.next.template.content, "{%if variable %}{% endif%}");
        assert.equal(tree._start.next.next.depth, 0);
    });


    it('Tree create() method : success with a complex template', function () {
        const template = new Template(fs.readFileSync(path.resolve(__dirname, "./template/body.html.ste")).toString());
        const context = {};
        const style = "";
        const tree = new Tree(template);

        tree.create();

        let currentNode = tree._start;

        assert.equal(currentNode.template.content.replace(/\s/g, ""), "{% if variable %}{% if variables1.length === 1 %}<title>{{ variable }}</title>{% endif %}{% endif %}".replace(/\s/g, ""));
        assert.equal(currentNode.open.lineNumber, 7);
        assert.equal(currentNode.children.length, 1);
        assert.equal(currentNode.children[0].isIfCategory(), true);
        assert.equal(currentNode.children[0].open.rawContent, "{% if variables1.length === 1 %}");
        assert.equal(currentNode.children[0].open.lineNumber, 8);
        assert.equal(currentNode.children[0].depth, 1);
        assert.equal(currentNode.children[0].children[0].isVarCategory(), true);
        assert.equal(currentNode.children[0].children[0].open.rawContent, "{{ variable }}");
        assert.equal(currentNode.children[0].children[0].open.lineNumber, 9);
        assert.equal(currentNode.children[0].children[0].depth, 2);

        currentNode = currentNode.next;

        assert.equal(currentNode.open.rawContent, "{{variable}}");
        assert.equal(currentNode.open.lineNumber, 21);
        assert.equal(currentNode.depth, 0);
        currentNode = currentNode.next;

        assert.equal(currentNode.open.rawContent, "{{url}}");
        assert.equal(currentNode.open.lineNumber, 38);
        assert.equal(currentNode.depth, 0);
        currentNode = currentNode.next;

        assert.equal(currentNode.template.content.replace(/\s/g, ""), "{% if variables2.length === 1 %}<div>{{ variable }}</div>{% endif %}".replace(/\s/g, ""));
        assert.equal(currentNode.open.lineNumber, 67);
        assert.equal(currentNode.depth, 0);
        assert.equal(currentNode.children[0].open.rawContent, "{{ variable }}");
        assert.equal(currentNode.children[0].open.lineNumber, 68);
        assert.equal(currentNode.children[0].depth, 1);

        currentNode = currentNode.next;

        assert.equal(currentNode.template.content.replace(/\s/g, ""), "{% if variable %}<div><div>{{ variable }}</div><div>{{ variable }}</div></div><br/>{% endif %}".replace(/\s/g, ""));
        assert.equal(currentNode.open.lineNumber, 86);
        assert.equal(currentNode.depth, 0);
        assert.equal(currentNode.children[0].open.rawContent, "{{ variable }}");
        assert.equal(currentNode.children[0].open.lineNumber, 89);
        assert.equal(currentNode.children[0].depth, 1);
        assert.equal(currentNode.children[0].next.open.rawContent, "{{ variable }}");
        assert.equal(currentNode.children[0].next.open.lineNumber, 92);
        assert.equal(currentNode.children[0].next.depth, 1);
        currentNode = currentNode.next;

        assert.equal(currentNode.open.rawContent, "{{ variable }}");
        assert.equal(currentNode.open.lineNumber, 99);
        currentNode = currentNode.next;

        assert.equal(currentNode.open.rawContent, "{{url}}");
        assert.equal(currentNode.open.lineNumber, 102);
        currentNode = currentNode.next;

        assert.equal(currentNode.open.rawContent, "{{ url }}");
        assert.equal(currentNode.open.lineNumber, 102);
        currentNode = currentNode.next;

        assert.equal(currentNode.open.rawContent, "{{ variable }}");
        assert.equal(currentNode.open.lineNumber, 108);
        currentNode = currentNode.next;

        assert.equal(currentNode.open.rawContent, "{{ variable }}");
        assert.equal(currentNode.open.lineNumber, 111);
        currentNode = currentNode.next;

        assert.equal(currentNode.open.rawContent, "{{ variable }}");
        assert.equal(currentNode.open.lineNumber, 117);
        currentNode = currentNode.next;

        assert.equal(currentNode.open.rawContent, "{{ variable }}");
        assert.equal(currentNode.open.lineNumber, 120);
        currentNode = currentNode.next;

        assert.equal(currentNode.template.content.replace(/\s/g, ""), "{% if variables3.length === 1 %}{{ variable }}{% endif %}".replace(/\s/g, ""));
        assert.equal(currentNode.open.lineNumber, 126);
        assert.equal(currentNode.children[0].open.rawContent, "{{ variable }}");
        assert.equal(currentNode.children[0].open.lineNumber, 127);
        currentNode = currentNode.next;

        assert.equal(currentNode.template.content.replace(/\s/g, ""), "{% for variable in variables %}<a>{{ variable.key }}</a><br/>{% endfor %}".replace(/\s/g, ""));
        assert.equal(currentNode.open.lineNumber, 130);
        assert.equal(currentNode.children[0].open.rawContent, "{{ variable.key }}");
        assert.equal(currentNode.children[0].open.lineNumber, 132);
        currentNode = currentNode.next;

        assert.equal(currentNode.template.content.replace(/\s/g, ""), "{% if !variable %}<table><tbody><tr><td><table><tbody><tr><td><table><tbody><tr><td><a href=\"https:\/\/{{url}}\" target=\"_blank\"><img src=\"https:\/\/{{ url }}\" alt=\"\"></a></td></tr></tbody></table><div><span>{{ variable }}</span></div></td></tr></tbody></table></td></tr></tbody></table>{% endif %}".replace(/\s/g, ""));
        assert.equal(currentNode.open.lineNumber, 149);
        assert.equal(currentNode.children[0].open.rawContent, "{{url}}");
        assert.equal(currentNode.children[0].open.lineNumber, 162);
        assert.equal(currentNode.children[1].open.rawContent, "{{ url }}");
        assert.equal(currentNode.children[1].open.lineNumber, 163);
        assert.equal(currentNode.children[2].open.rawContent, "{{ variable }}");
        assert.equal(currentNode.children[2].open.lineNumber, 170);
        currentNode = currentNode.next;
    });


    it('Tree _getNextNode() method: return the good node', function () {
        // TODO
    });

    it('Tree execute() method: execute a template', function () {
        // TODO
    });

});
