"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MON_WRITTEN = exports.MON_WRITTEN_KEY = exports.WRITTEN_TO_ALPHABET = exports.KEY_MAP = void 0;
var keyMap_1 = require("./keyMap");
Object.defineProperty(exports, "KEY_MAP", { enumerable: true, get: function () { return __importDefault(keyMap_1).default; } });
var writtenToAlphabetMap_1 = require("./writtenToAlphabetMap");
Object.defineProperty(exports, "WRITTEN_TO_ALPHABET", { enumerable: true, get: function () { return __importDefault(writtenToAlphabetMap_1).default; } });
var MON_WRITTEN_KEY;
(function (MON_WRITTEN_KEY) {
    MON_WRITTEN_KEY["a"] = "\u1820";
    MON_WRITTEN_KEY["b"] = "\u182A";
    MON_WRITTEN_KEY["ch"] = "\u1834";
    MON_WRITTEN_KEY["d"] = "\u1833";
    MON_WRITTEN_KEY["e"] = "\u1821";
    MON_WRITTEN_KEY["f"] = "\u1839";
    MON_WRITTEN_KEY["g"] = "\u182D";
    MON_WRITTEN_KEY["h"] = "\u182C";
    MON_WRITTEN_KEY["i"] = "\u1822";
    MON_WRITTEN_KEY["j"] = "\u1835";
    MON_WRITTEN_KEY["k"] = "\u183A";
    MON_WRITTEN_KEY["l"] = "\u182F";
    MON_WRITTEN_KEY["m"] = "\u182E";
    MON_WRITTEN_KEY["n"] = "\u1828";
    MON_WRITTEN_KEY["o"] = "\u1823";
    MON_WRITTEN_KEY["p"] = "\u182B";
    MON_WRITTEN_KEY["r"] = "\u1837";
    MON_WRITTEN_KEY["s"] = "\u1830";
    MON_WRITTEN_KEY["t"] = "\u1832";
    MON_WRITTEN_KEY["u"] = "\u1825";
    MON_WRITTEN_KEY["v"] = "\u1838";
    MON_WRITTEN_KEY["w"] = "\u180A";
    MON_WRITTEN_KEY["sh"] = "\u1831";
    MON_WRITTEN_KEY["y"] = "\u1836";
    MON_WRITTEN_KEY["z"] = "\u183D";
    MON_WRITTEN_KEY["connector"] = "\u180A";
    MON_WRITTEN_KEY["ts"] = "\u183C";
    MON_WRITTEN_KEY["lh"] = "\u1840";
    MON_WRITTEN_KEY["ng"] = "\u1829";
})(MON_WRITTEN_KEY = exports.MON_WRITTEN_KEY || (exports.MON_WRITTEN_KEY = {}));
exports.MON_WRITTEN = {
    vovels: ['ᠠ', 'ᠶ', 'ᠣ', 'ᠢ', 'ᠥ', 'ᠣ', 'ᠥ', 'ᠡ', '᠊ᠢ', 'ᡀ', 'ᠩ'],
    consonants: ['ᠪ', 'ᠸ', 'ᠭ', 'ᠳ', 'ᠵ', 'ᠺ', 'ᠯ', 'ᠮ', 'ᠨ', 'ᠫ', 'ᠷ', 'ᠰ', 'ᠲ', 'ᠹ', 'ᠬ', 'ᠴ', 'ᠱ', 'ᠽ', 'ᠼ', 'ᠩ'],
    consonantWithoutN: ['ᠪ', 'ᠸ', 'ᠭ', 'ᠳ', 'ᠵ', 'ᠺ', 'ᠯ', 'ᠮ', 'ᠫ', 'ᠷ', 'ᠰ', 'ᠲ', 'ᠹ', 'ᠬ', 'ᠴ', 'ᠱ', 'ᠽ', 'ᠼ'],
    consonantsHard: ['ᠪ', 'ᠭ', 'ᠵ', 'ᠳ', 'ᠺ', 'ᠫ', 'ᠷ', 'ᠰ', 'ᠲ', 'ᠹ', 'ᠬ', 'ᠴ', 'ᠱ', 'ᠽ', 'ᠼ'],
    consonantsSoft: ['ᠸ', 'ᠯ', 'ᠮ', 'ᠨ', 'ᠩ'],
};
//# sourceMappingURL=index.js.map