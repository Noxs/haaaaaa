const TemplateEngine = require('./class/TemplateEngine.js');

let templateEngine = new TemplateEngine();

// let template = '<p>{{ test2.troll}}</p><p>{{ testest.troll.testTroll }}</p><p>{{ testString }}</p><p>{{test.troll }}</p>{% for user in users %}<p>{{user.firstname}}</p>{% for sport in sports %}<p>{{sport.name}}</p>{% endfor %}{% endfor %}{% for film in films %}<p>{{film.title}}</p>{% for game in games %}<p>{{game.name}}</p>{% endfor %}{% endfor %}'; // with 4forloops
// let template = '<p>{{ test2.troll}}<p><p>{{ testest.troll.testTroll }}<p><p>{{ testString }}<p><p>{{test.troll }}<p>{% for user in users %}<p>{{user.firstname}}</p>{% endfor %}';  // with 1 for loop
let template = '<p>{{ test2.troll}}<p><p>{{ testest.troll.testTroll }}<p><p>{{ testString }}<p><p>{{test.troll }}<p>';  // with 1 for loop

let context = {
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


templateEngine.render(template, context).then(function (response) {
    let compiledTemplate = response;
    // console.log("1", compiledTemplate);
},function (error) {
    console.log(error);
});
