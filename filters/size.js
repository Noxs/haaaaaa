const translator = require('../lib/translator.js');

const units = {
    0: "B",
    3: "KB",
    6: "MB",
    9: "GB",
    12: "TB",
    15: "PB"
};

function size(number) {
    const translator = this._templateEngine.translator;
    if (!Number.isInteger(number)) {
        number = parseInt(number);
    }
    if (isNaN(number)) {
        let error = new Error("Failed to parse, " + number + " (type : " + typeof number + ") into number");
        error.steUsageFailure = true;
        throw error;
    }
    let formattedNumber = number;
    let index = 0;
    while (formattedNumber >= 1000 && index < 15) {
        formattedNumber = Math.trunc(formattedNumber / 100) / 10;
        index += 3;
    }

    formattedNumber = formattedNumber.toString();
    let unit = units[index];
    try {
        unit = translator.translate(unit);
    } catch (error) {
        console.info("Translations for unit " + unit + " are missing");
    }

    return formattedNumber + " " + unit;
}

module.exports = size;
