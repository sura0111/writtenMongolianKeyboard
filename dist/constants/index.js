"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WRITTEN_MONGOL_TYPE = exports.WRITTEN_MONGOL_KEY = exports.WRITTEN_TO_ALPHABET = exports.KEY_MAP = void 0;
var keyMap_1 = require("./keyMap");
Object.defineProperty(exports, "KEY_MAP", { enumerable: true, get: function () { return __importDefault(keyMap_1).default; } });
var writtenToAlphabetMap_1 = require("./writtenToAlphabetMap");
Object.defineProperty(exports, "WRITTEN_TO_ALPHABET", { enumerable: true, get: function () { return __importDefault(writtenToAlphabetMap_1).default; } });
var WRITTEN_MONGOL_KEY;
(function (WRITTEN_MONGOL_KEY) {
    WRITTEN_MONGOL_KEY["a"] = "\u1820";
    WRITTEN_MONGOL_KEY["b"] = "\u182A";
    WRITTEN_MONGOL_KEY["ch"] = "\u1834";
    WRITTEN_MONGOL_KEY["d"] = "\u1833";
    WRITTEN_MONGOL_KEY["e"] = "\u1821";
    WRITTEN_MONGOL_KEY["f"] = "\u1839";
    WRITTEN_MONGOL_KEY["g"] = "\u182D";
    WRITTEN_MONGOL_KEY["h"] = "\u182C";
    WRITTEN_MONGOL_KEY["i"] = "\u1822";
    WRITTEN_MONGOL_KEY["j"] = "\u1835";
    WRITTEN_MONGOL_KEY["k"] = "\u183A";
    WRITTEN_MONGOL_KEY["l"] = "\u182F";
    WRITTEN_MONGOL_KEY["m"] = "\u182E";
    WRITTEN_MONGOL_KEY["n"] = "\u1828";
    WRITTEN_MONGOL_KEY["o"] = "\u1823";
    WRITTEN_MONGOL_KEY["p"] = "\u182B";
    WRITTEN_MONGOL_KEY["r"] = "\u1837";
    WRITTEN_MONGOL_KEY["s"] = "\u1830";
    WRITTEN_MONGOL_KEY["t"] = "\u1832";
    WRITTEN_MONGOL_KEY["u"] = "\u1825";
    WRITTEN_MONGOL_KEY["v"] = "\u1838";
    WRITTEN_MONGOL_KEY["w"] = "\u180A";
    WRITTEN_MONGOL_KEY["sh"] = "\u1831";
    WRITTEN_MONGOL_KEY["y"] = "\u1836";
    WRITTEN_MONGOL_KEY["z"] = "\u183D";
    WRITTEN_MONGOL_KEY["connector"] = "\u180A";
    WRITTEN_MONGOL_KEY["ts"] = "\u183C";
    WRITTEN_MONGOL_KEY["lh"] = "\u1840";
    WRITTEN_MONGOL_KEY["ng"] = "\u1829";
})(WRITTEN_MONGOL_KEY = exports.WRITTEN_MONGOL_KEY || (exports.WRITTEN_MONGOL_KEY = {}));
exports.WRITTEN_MONGOL_TYPE = {
    vovels: ['ᠠ', 'ᠶ', 'ᠣ', 'ᠢ', 'ᠥ', 'ᠣ', 'ᠥ', 'ᠡ', '᠊ᠢ', 'ᡀ', 'ᠩ'],
    consonants: ['ᠪ', 'ᠸ', 'ᠭ', 'ᠳ', 'ᠵ', 'ᠺ', 'ᠯ', 'ᠮ', 'ᠨ', 'ᠫ', 'ᠷ', 'ᠰ', 'ᠲ', 'ᠹ', 'ᠬ', 'ᠴ', 'ᠱ', 'ᠽ', 'ᠼ', 'ᠩ'],
    consonantWithoutN: ['ᠪ', 'ᠸ', 'ᠭ', 'ᠳ', 'ᠵ', 'ᠺ', 'ᠯ', 'ᠮ', 'ᠫ', 'ᠷ', 'ᠰ', 'ᠲ', 'ᠹ', 'ᠬ', 'ᠴ', 'ᠱ', 'ᠽ', 'ᠼ'],
    consonantsHard: ['ᠪ', 'ᠭ', 'ᠵ', 'ᠳ', 'ᠺ', 'ᠫ', 'ᠷ', 'ᠰ', 'ᠲ', 'ᠹ', 'ᠬ', 'ᠴ', 'ᠱ', 'ᠽ', 'ᠼ'],
    consonantsSoft: ['ᠸ', 'ᠯ', 'ᠮ', 'ᠨ', 'ᠩ'],
};
//# sourceMappingURL=index.js.map