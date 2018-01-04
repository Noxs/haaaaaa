module.exports = {
    checkQuoteMarks : function(string){
        if (typeof(string) !== 'string') {
            throw new Error('First parameter of checkQuoteMarks() util function must be a string');
        }
        if((string.substring(0,1) === "'") && (string.substring(string.length-1, string.length) === "'") || (string.substring(0,1) === '"') && (string.substring(string.length-1, string.length) === '"')){
            return true;
        }else {
            return false;
        }
    },
    extractFromQuoteMarks : function(string){
        if (typeof(string) !== 'string') {
            throw new Error('First parameter of extractFromQuoteMarks() util function must be a string');
        }
        return string.substr(1, string.length -1 -1 );
    }
};
