"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dictionary = void 0;
const tslib_1 = require("tslib");
const constants_1 = require("./constants");
const dictionary_json_1 = tslib_1.__importDefault(require("./constants/dictionary.json"));
const { dict } = dictionary_json_1.default;
var DictionaryMapper;
(function (DictionaryMapper) {
    DictionaryMapper["alphabet"] = "latin_direct";
    DictionaryMapper["written"] = "written";
    DictionaryMapper["cyrillic"] = "cyrillic";
})(DictionaryMapper || (DictionaryMapper = {}));
class Dictionary {
    static generateConversionWords(chars) {
        let t = [];
        for (const c1 of chars) {
            let t1;
            if (t.length === 0) {
                t1 = c1;
            }
            else {
                t1 = [];
                for (const c2 of c1) {
                    const t2 = t.slice().map((t) => `${t}${c2}`);
                    t1 = [...t1, ...t2];
                }
            }
            t = t1.slice();
        }
        return t;
    }
    static cyrillic(text) {
        const chars = text.split('').map((char) => { var _a, _b; return (_b = (_a = constants_1.WRITTEN_TO_ALPHABET[char]) === null || _a === void 0 ? void 0 : _a.cyrillic) !== null && _b !== void 0 ? _b : [char]; });
        return Dictionary.generateConversionWords(chars);
    }
    static alphabet(text) {
        const chars = text.split('').map((char) => { var _a, _b; return (_b = (_a = constants_1.WRITTEN_TO_ALPHABET[char]) === null || _a === void 0 ? void 0 : _a.alphabet) !== null && _b !== void 0 ? _b : [char]; });
        return Dictionary.generateConversionWords(chars);
    }
    static getConversionsFromType(type, text) {
        return dict
            .filter((item) => { var _a; return ((_a = item[DictionaryMapper[type]]) === null || _a === void 0 ? void 0 : _a.indexOf(text)) === 0; })
            .sort((a, b) => a.written.length - b.written.length)
            .slice(0, Dictionary.maxConversions);
    }
    static getConversionsFromWritten(type, text) {
        if (type === 'written') {
            return Dictionary.getConversionsFromType(type, text);
        }
        return [].concat(...Dictionary[type](text).map((word) => {
            return Dictionary.getConversionsFromType(type, word);
        }));
    }
    static getConversions(text, precedingWord) {
        if (!text) {
            return [];
        }
        const conversions = [
            ...Dictionary.getConversionsFromWritten('written', text),
            ...Dictionary.getConversionsFromWritten('cyrillic', text),
            ...Dictionary.getConversionsFromWritten('alphabet', text),
        ]
            .filter((a, i, arr) => a.written &&
            !arr
                .slice(0, i)
                .map((b) => b.written)
                .includes(a.written))
            .sort((a, b) => a.written.length - b.written.length);
        if (!conversions.find((item) => item.written === text)) {
            conversions.splice(0, 0, { written: text });
        }
        const precedingChar = precedingWord === null || precedingWord === void 0 ? void 0 : precedingWord.slice(-1);
        if (constants_1.WRITTEN_MONGOL_TYPE.vovels.includes(precedingChar) && ['᠊ᠣᠨ', '᠊ᠣ', 'ᠢᠢᠨ', 'ᠣ', 'ᠢᠢ'].includes(text)) {
            conversions.splice(0, 0, { written: '᠊ᠢᠢᠨ' });
        }
        else if (constants_1.WRITTEN_MONGOL_TYPE.consonantWithoutN.includes(precedingChar) &&
            ['᠊ᠢᠢᠨ', '᠊ᠣ', 'ᠢᠢᠨ', 'ᠣ', 'ᠢᠢ'].includes(text)) {
            conversions.splice(0, 0, { written: '᠊ᠣᠨ' });
        }
        else if (precedingChar === 'ᠨ' && ['᠊ᠢᠢᠨ', '᠊ᠣᠨ', 'ᠢᠢᠨ', 'ᠣ', 'ᠢᠢ'].includes(text)) {
            conversions.splice(0, 0, { written: '᠊ᠣ' });
        }
        else if (constants_1.WRITTEN_MONGOL_TYPE.vovels.includes(precedingChar) && ['᠊ᠢᠢ', 'ᠭ', 'ᠢᠢᠭ'].includes(text)) {
            conversions.splice(0, 0, { written: '᠊ᠢ' });
        }
        else if (constants_1.WRITTEN_MONGOL_TYPE.consonants.includes(precedingChar) && ['᠊ᠢ', 'ᠭ', 'ᠢᠢᠭ'].includes(text)) {
            conversions.splice(0, 0, { written: '᠊ᠢᠢ' });
        }
        else if ((text === 'ᠠᠠᠰ' || text === 'ᠡᠡᠰ' || text === 'ᠣᠣᠰ') && precedingChar) {
            conversions.splice(0, 0, { written: 'ᠡᠴᠡ' });
        }
        else if (['ᠣᠣᠷ', 'ᠥᠥᠷ', 'ᠠᠠᠷ', 'ᠡᠡᠷ', 'ᠪᠠᠷ'].includes(text) &&
            constants_1.WRITTEN_MONGOL_TYPE.consonants.includes(precedingChar)) {
            conversions.splice(0, 0, { written: '᠊ᠢᠢᠠᠷ' });
        }
        else if (['᠊ᠳᠣ', 'ᠳᠣ', 'ᠳᠣᠷ', 'ᠳ', '᠊ᠲᠣ', 'ᠲᠣ', 'ᠲᠣᠷ', '᠊ᠲᠣᠷ', 'ᠲ'].includes(text) &&
            constants_1.WRITTEN_MONGOL_TYPE.consonantsSoft.includes(precedingChar)) {
            conversions.splice(0, 0, { written: '᠊ᠳᠣᠷ' });
        }
        else if (['᠊ᠳᠣ', 'ᠳᠣ', '᠊ᠳᠣᠷ', 'ᠳᠣᠷ', 'ᠳ', '᠊ᠲᠣ', 'ᠲᠣ', '᠊ᠲᠣᠷ', 'ᠲ'].includes(text)) {
            conversions.splice(0, 0, { written: 'ᠲᠣᠷ' });
        }
        else if (['ᠣᠣᠷ', 'ᠥᠥᠷ', 'ᠠᠠᠷ', 'ᠡᠡᠷ', '᠊ᠢᠢᠠᠷ'].includes(text) &&
            constants_1.WRITTEN_MONGOL_TYPE.vovels.includes(precedingChar)) {
            conversions.splice(0, 0, { written: 'ᠪᠠᠷ' });
        }
        return conversions;
    }
}
exports.Dictionary = Dictionary;
Dictionary.maxConversions = 10;
//# sourceMappingURL=dictionary.js.map