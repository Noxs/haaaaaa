class Translator {
    constructor() {
        this._translations = null;
        this._language = null;
        this._fallbackLanguage = null;
    }

    translate(keyword) {
        if (typeof (keyword) !== 'string') {
            throw new Error('First parameter of translate(keyword) must be a string, ' + typeof keyword + " given");
        }
        if (typeof this.translations[keyword] === "undefined") {
            throw new Error("Keyword " + keyword + " not found in translations");
        }
        if (typeof (this.translations[keyword][this.language]) === "undefined" && typeof (this.translations[keyword][this.fallbackLanguage]) === "undefined") {
            throw new Error('There is no translation for the keyword ' + keyword + ', neither in the language nor in the fallback language');
        }
        if (typeof (this.translations[keyword][this.language]) === "undefined" && typeof (this.translations[keyword][this.fallbackLanguage]) !== "undefined") {
            return this.translations[keyword][this.fallbackLanguage];
        }
        return this.translations[keyword][this.language];
    }

    set translations(translations) {
        if (typeof (translations) !== 'object') {
            throw new Error('Property translations of translator must be an object, ' + typeof translations + " given");
        }
        this._translations = translations;
    }

    get translations() {
        return this._translations;
    }

    set language(language) {
        //TODO ?  should language be compared to all languages existing in translations (in case of asking a language that doesn't exist)
        if (typeof (language) !== 'string') {
            throw new Error('Property language of translator must be a string, ' + typeof language + " given");
        }
        this._language = language;
    }

    get language() {
        return this._language;
    }

    set fallbackLanguage(language) {
        if (typeof (language) !== 'string') {
            throw new Error('Property fallbackLanguage of translator must be a string, ' + typeof language + " given");
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
