export default {
    entityToChar(str: string) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = str;
        return textarea.value;
    },
    encodeHTML(str: string) {
        return str.replace(/[<>&"'](?!#)/gim, function(i) {
            return '&#' + i.charCodeAt(0) + ';';
        });
    },
    decodeHTML(str: string) {
        return str.replace(/&#([0-9]{1,3});/gi, function(match, num) {
            return String.fromCharCode(parseInt(num));
        });
    }
}