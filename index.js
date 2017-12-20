const TemplateEngine = require('./lib/templateEngine.js');
const translator = require('./lib/translator.js');

let templateEngine = new TemplateEngine();

// let template = '<p>{{ test2.troll}}</p><p>{{ testest.troll.testTroll }}</p><p>{{ testString }}</p><p>{{test.troll }}</p>{% for user in users %}<p>{{user.firstname}}</p>{% for sport in sports %}<p>{{sport.name}}</p>{% endfor %}{% endfor %}{% for film in films %}<p>{{film.title}}</p>{% for game in games %}<p>{{game.name}}</p>{% endfor %}{% endfor %}'; // with 4forloops
// let template = '<p>{{ test2.troll}}<p><p>{{ testest.troll.testTroll }}<p><p>{{ testString }}<p><p>{{test.troll }}<p>{% for user in users %}<p>{{user.firstname}}</p>{% endfor %}';  // with 1 for loop
const template = '<p>{{ test2.troll}}<p><p>{{ testest.troll.testTroll }}<p><p>{{ testString }}<p><p>{{test.troll }}<p>';  // with 1 for loop

const context = {
    "test" : {
        troll : "yolo"
    },
    "test2" : {
        troll : "yolo2"
    },
    "testest" : {
        troll : {
            testTroll : 2,
        }
    },
    testString : "c'est un test",
    users : [
        {
            firstname : "Michel",
            lastname : "Tournier",
            age : "12",
        },
        {
            firstname : "Jean",
            lastname : "Bon",
            age : "15",
        },
        {
            firstname : "Jade",
            lastname : "Issionne",
            age : "43",
        },
    ],
    sports : [
        {
            name : "Handball",
            team : 7,
            required : ["Ball", "Goals"],
        },
        {
            name : "Tennis",
            team : 1,
            required : ['Ball', 'Raquet'],
        },
    ],
    films : [
        {
            title : "OSS117",
            note : "10/5",
        },
        {
            title : "Un film nul",
            note : "0/1000",
        },
    ],
    games : [
        {
            name : "LoL",
            rage : "high",
        },
        {
            name : "Fishing Simulator",
            rage : "Chill",
        },
    ],
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

const language = 'fr';
const fallbackLanguage = 'en';

translator.translations = translations;
translator.language = language;
translator.fallbackLanguage = fallbackLanguage;

templateEngine.render(template, context).then(function (response) {
    let compiledTemplate = response;
},function (error) {
    console.log(error);
});
