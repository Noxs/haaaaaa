# SmashTemplateEngine [![Build Status](https://travis-ci.org/Noxs/SmashTemplateEngine.svg?branch=master)](https://travis-ci.org/Noxs/SmashTemplateEngine) [![codecov](https://codecov.io/gh/Noxs/SmashTemplateEngine/branch/master/graph/badge.svg)](https://codecov.io/gh/Noxs/SmashTemplateEngine)

//FIXME Update documentation
//FIXME When filters are not fetch in styleNode, FilterNotFound exception is not thrown, why?

A template Engine with basic features :<br />
&ensp;&ensp;- Variables handling<br />
&ensp;&ensp;- If condition<br />
&ensp;&ensp;- For loops<br />
&ensp;&ensp;- Filters handling<br />

## Getting Started

Here you will find how to install this package and syntax that should be used in templates.

### Installing

All you need is to install the npm package.

```
npm install smash-template-engine
```

You can now require the package and create an instance of TemplateEngine :

```
const STE = require('smash-template-engine');
const templateEngine = new STE(); 
```

## Usage

The only method you need is templateEngine.render().
It takes three parameters :<br />
&ensp;&ensp;- The first one is a string, which is actually your template<br />
&ensp;&ensp;- The second one (optional) is an object, it corresponds to your context, containing all the variables used in the template (key in the context witch starts with '_' are not supported)<br />
&ensp;&ensp;- The third one (optional) is a string that corresponds to your stylesheet. You can put your css into a seperated file, to improve performances <br />

templateEngine.render() method is synchronous, it return an object with a 'content' attribute which is basically the compiled template.

To make it simple, it should look like :

```
const renderer = templateEngine.render(string[, parameters, style]);
```

### Seperated CSS

If you want to use a seperated CSS file, don't forget to specify it as third parameter of templateEngine.render().

To tell the templateEngine where to insert the CSS in your template, you will need :

```
{% style %}
```

## Syntax

It is highly inspired of twig, so it might look familiar.

### Variables

It is the most common feature, it allow you to insert variables from the context into a template.

```
{{ Variable }}
```

### If condition

Everything between the opening and the closing tag will be either inserted or removed in the compiled template depending on if the condition is checked or not. The else and elseif statement also works as known.

```
{% if 'hello' === 'world' %}
    It won't be inserted
{% elseif 'hello' === 'hola' %}
    It won't be inserted
{% else %}
    It will be inserted
{% endif %}
{% if 1 === 1 %} It will be inserted {% endif %}
```

### For loop

Everything between the opening and the closing will be repeated as many as there's key in a given object that is defined in the context.

```
{% for user in users %} {{user.name}} is {{user.age}} years old. {% endfor %}
```

## Filters

There is no build-in filters. Fortunately, you can add your owns !

In a template, a filter may look like this : 

```
{{ myVar | myFilter }}

{{ myVar | myFilter({customVar: "This is a string"}) }}     // A template can also be designed to receive parameter into an object
```

Every Filter must have getName() and execute() methods.

The execute() method take three arguments : <br/>
&ensp;&ensp;- The first one (string type) is the input at the left of the pipe (hereabove "myVar")<br />
&ensp;&ensp;- The second one (optional) is an object, it corresponds to the parameter set at the right of pipe (hereabove {customVar: "This is a string"})<br />
&ensp;&ensp;- The third one (optional) is an object that corresponds to your global context set in STE<br />

```
class FilterTest {
    getName() {
        return "myFilter"; //This is the name to use in the template 
    }

    execute(input, param, context) {
        // do things
        return;
    }
}
```

Let's create a basic filter. We will give it an age and it will display "You are above the limit" or "you are under the limit" either the age is bigger or not than a limit we will set in the filter's parameters.

```
class FilterTest {
    getName() {
        return "myFilter"; //This is the name to use in the template 
    }

    execute(input, param, context) {
        if (input > param.ageLimit) {
            return "You are above the limit";
        } else {
            return "You are under the limit";
        }
        return;
    }
}

templateEngine.addFilter(new FilterTest());
const renderer1 = templateEngine.render("{{age | myFilter({ageLimit: 21})}}", {age: 22}); // "You are above the limit"
const renderer2 = templateEngine.render("{{age | myFilter({ageLimit: 21})}}", {age: 19}); // "You are under the limit"
```

Nevertheless another project ([SmashTemplateEngineFilters](https://www.npmjs.com/package/smash-template-engine-filters)) proposes some basic filters : 

&ensp;&ensp;- Translate<br />
&ensp;&ensp;- Date<br />
&ensp;&ensp;- Size<br />
&ensp;&ensp;- Plural<br />
&ensp;&ensp;- UcFirst<br />


First of all if you want to use smash-template-engine-filters, you will need to install the package:

```
npm i smash-template-engine-filters
```

Let's create an instance

```
const Filters = require('smash-template-engine-filters');
const filters = new Filters();
```

Now you can add filters you need to your template engine thanks to templateEngine.addFilter(). But keep in mind that Date and Size filters needs Translate filter to work properly.

You should really read the [Smash Template Engine Filters Doc](https://github.com/Noxs/SmashTemplateEngineFilters) if your not used to it.

### Nested filters

Sometimes, you may need nested filter, to apply a filter on the result of another filter.

Let's have a look of a case you may face : use date into a translation that are included in [SmashTemplateEngineFilters](https://www.npmjs.com/package/smash-template-engine-filters).

```
const translations : {
    "HELLO_WORD" : "Hello %name%. Today is %date%"
};
const timestamp = 1517407220;
{{"HELLO_WORD" | translate( { name : "James", date : date(timestamp, {format : ""MMMM Do YYYY"})} )}} // Hello James. Today is January 31st 2018
```

## Running the tests

Tests are run with Mocha and Chai.

```
npm test
```

## Examples

Here is a full examples of how to use the template engine.

```
const STE = require('smash-template-engine');
const Filters = require('smash-template-engine-filters');

const template = '<body><main>{{"HELLO_WORD" | translate}}</main><h1>{%if title %}{{title}}{% endif %}</h1><div>{% for user in users %}<p>{%if user.hobby %}{{user.firstname}} enjoys {{user.hobby}}{% endif %}{% if user.age < 30 %} and is {{user.age}} {% endif %}{{user.firstname}} lastname is {{user.lastname}}</p>{% endfor %}<p>{{day | dayTest(\'Monday\')}}</p></div></body>';

const parameters = {
    title : "Welcome",
    users : [
        {
            firstname : "Antoine",
            lastname : "Dupont",
            age : 30,
            hobby : null,
        },
        {
            firstname : "Bonz",
            lastname : "Atron",
            age : "25",
            hobby : "Kendama"
        }
    ],
    day : 'Friday',
};
const translations = {
    'HELLO_WORD' : {
        en : 'Hello',
        fr : 'Bonjour',
        de : 'Hallo'
    },
    'HOW_ARE_YOU_QUESTION' : {
        en : 'How are you?',
        fr : 'Comment ça va?',
        de : "Wie geht's?"
    }
};

const filters = new Fitler();
const translator = new filters.Translate(translations);
const translator.language = 'en';

const templateEngine = new STE();
templateEngine.addFilter(translator);
templateEngine.addFilter(new filters.Date(translator));
templateEngine.addFilter(new filters.Size(translator));

const renderer = templateEngine.render(string, parameters);
```

renderer now should be :

```
'<body><main>Hello</main><h1>Welcome</h1><div><p>Antoine lastname is Dupont</p><p>Bonz enjoys Kendama and is 25 Bonz lastname is Atron</p><p>It is not Monday. It is Friday.</p></div></body>'
```
