class Translator {
    constructor() {
        this._translations = null;
        this._language = null;
        this._fallbackLanguage = null;
    }

    translate(keyword) {
        if (typeof (keyword) !== 'string') {
            throw new Error('First parameter of Translator translate() method must be a string.');
        }
        if (!this.translations[keyword]) {
            throw new Error('The keyword ' + keyword + ' not found in translator._translations.');
        }
        if (!(this.translations[keyword][this.language]) && !(this.translations[keyword][this.fallbackLanguage])) {
            throw new Error('There is no translation for the keyword ' + keyword + ', neither in the language nor in the fallback language.');
        }
        if (!(this.translations[keyword][this.language]) && this.translations[keyword][this.fallbackLanguage]) {
            return this.translations[keyword][this.fallbackLanguage];
        }

        return this.translations[keyword][this.language];

    }

    set translations(translations) {
        if (typeof (translations) !== 'object') {
            throw new Error('translator.translations must be an object.');
        }
        this._translations = translations;
    }

    get translations() {
        return this._translations;
    }

    set language(language) {
        //TODO ?  should language be compared to all languages existing in translations (in case of asking a language that doesn't exist)
        if (typeof (language) !== 'string') {
            throw new Error('translator.language must be a string.');
        }
        this._language = language;
    }

    get language() {
        return this._language;
    }

    set fallbackLanguage(language) {
        if (typeof (language) !== 'string') {
            throw new Error('translator.fallbackLanguage must be a string.');
        }
        this._fallbackLanguage = language;
    }

    get fallbackLanguage() {
        return this._fallbackLanguage;
    }
}


if (!global.Translator) {
    global.Translator = new Translator();
}

module.exports = global.Translator;
