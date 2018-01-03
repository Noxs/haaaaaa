# SmashTemplateEngine [![Build Status](https://travis-ci.org/Noxs/SmashTemplateEngine.svg?branch=master)](https://travis-ci.org/Noxs/SmashTemplateEngine) [![codecov](https://codecov.io/gh/Noxs/SmashTemplateEngine/branch/master/graph/badge.svg)](https://codecov.io/gh/Noxs/SmashTemplateEngine)

A template Engine with basic features :
&ensp;&ensp;- Variables handling
&ensp;&ensp;- If condition
&ensp;&ensp;- For loops
&ensp;&ensp;- Filters handling

## Getting Started

Here you will find how to install this package and syntax that should be used in templates.

### Installing

All you need is to install the npm package.

```
npm install smash-template-engine
```

## Usage

The only method you need is templateEngine.render().
It takes two parameters :
&ensp;&ensp;- The first one is a string, which is actually your template
&ensp;&ensp;- The second one is an object, it corresponds to your context, containing all the variables used in the template

templateEngine.render() method is asynchronous, it resolves an object with a content attribute which is basically the compiled template.

To make it simple, it should look like :

```
templateEngine.render(string, parameters).then(function (template) {
    let rendered = template.content;
},function (error) {
    console.log(error);
});
```

### Translate Filter

If you pretend to use the translate filter you will have to check few easy peasy steps before.
The template engine needs to know the translations used in the template, but also the wished language and a default language that is used as fallback.

A translator object manages the translation, so all you need may look like this :

```
const translations = {
    'HELLO_WORD' : {
        en : 'Hello',
        fr : 'Bonjour',
        de : 'Hallo'
    }
};
const language = 'fr';
const fallbackLanguage = 'en';

translator.translations = translations;
translator.language = language;
translator.fallbackLanguage = fallbackLanguage;
```
You can now call the translate filter in your template.

## Syntax

It is highly inspired of twig, so it might look familiar.

### Variables

It is the most common feature, it allow you to insert variables from a context into a template.

```
{{ Variable }}
```

### If condition

Everything between the opening and the closing tag will be either inserted or removed in the compiled template depending on if the condition is checked or not.

```
{% if 'hello' === 'world' %} It won't be inserted {% endif %}
{% if 1 === 1 %} It will be inserted {% endif %}
```

### For loop

Everything between the opening and the closing will be repeated as many as there's key in a given object that is defined in the context.

```
{% for user in users %} {{user.name}} is {{user.age}} years old. {% endfor %}
```

### Filters

Filters allow to apply treatment on a variable. There's a translate filter build in, it looks like this :

```
{{ 'HELLO_KEYWORD' | translate }}
```

n.b : In order to use translate filter, you'll need to tell translator your intention, make sure you've read * [Translate Filter](#translate-filter)

#### In order to add custom filter

You can add you own template to the template engine.
Filter have been thought as promise, so a very basic filter structure may look like this :
```
function myFilter(){
    return new Promise(function(resolve, reject) {
        resolve();
    });
}

module.exports = myFilter;
```
And make sure you placed your filter in /filters

Then you need to add your filter to the filters constructor located in lib/filters.js

Please take a look at how it should be :
```
const myFilter = {
        process : require('../filters/myFilter.js'),
        name : 'myFilter'
};
this.add(myFilter);
```

Now you can use :
```
{{ variable | myFilter }}
```

## Running the tests

Tests are run with Mocha and Chai.

```
npm test
```

## Examples

Here is a full examples of how to use the template engine.


```
const string = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="few words to describe the page"><title>{{"HELLO_WORD" | translate}}</title></head><body><main>{%if title %}{{title}}{% endif %}</main><div>{% for user in users %}<p>{%if user.hobby %}{{user.firstname}} enjoys {{user.hobby}}{% endif %}{% if user.age < 30 %} and is {{user.age}} {% endif %}{{user.firstname}} lastname is {{user.lastname}}</p>{% endfor %}<p>{{day | dayTest(\'Monday\')}}</p></div></body></html>';

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
const language = 'en';
const fallbackLanguage = 'fr';
translator.translations = translations;
translator.language = language;
translator.fallbackLanguage = fallbackLanguage;

templateEngine.render(string, parameters).then( (result) => {
    let rendered = result.content;
}, (error) => {
    console.log(error);
});
```

rendered = "<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="few words to describe the page"><title>Hello</title></head><body><main>Welcome</main><div><p>Antoine lastname is Dupont</p><p>Bonz enjoys Kendama and is 25 Bonz lastname is Atron</p><p>It is not Monday. It is Friday.</p></div></body></html>"
