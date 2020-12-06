"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const constants_1 = require("./constants");
const dictionary_1 = require("./dictionary");
const textareaSelection_1 = tslib_1.__importDefault(require("./textareaSelection"));
const textareaSelection = new textareaSelection_1.default();
class MongolianWritten {
    constructor() {
        this.isEnabled = false;
        this.localLastChange = {
            word: '',
            precedingWord: null,
            original: '',
            tips: [],
            tipId: 0,
            coordinate: { left: 0, top: 0 },
            element: null,
            caret: { start: 0, end: 0 },
        };
        this.onKeydown = (event) => {
            const element = textareaSelection.element(event.target);
            if (!this.isEnabled ||
                !element ||
                (this.lastChange.element && this.lastChange.element.textContent !== element.textContent) ||
                this.isSpecialKeys(event)) {
                this.resetChange();
                return;
            }
            this.lastChange.element = element;
            this.lastChange.coordinate = textareaSelection.coordinate(element);
            if (this.isConvertableKeys(event)) {
                this.insertMongolianWritten(event);
            }
            switch (event.key) {
                case 'Backspace':
                    // textareaSelection.insertTextWithRemove(element, '', 'character')
                    this.emitChange();
                    return;
                case ' ':
                case 'ArrowLeft':
                case 'ArrowRight':
                    return this.emitSpace(event, event.key === 'ArrowLeft' ? -1 : 1);
                case 'Enter':
                    return this.emitEnter(event);
                default:
                    break;
            }
        };
        this.eventListeners = {
            onChange: null,
        };
    }
    get lastChange() {
        return this.localLastChange;
    }
    set lastChange(value) {
        this.localLastChange = value;
        console.log(value);
        if (this.eventListeners.onChange) {
            this.eventListeners.onChange(value);
        }
    }
    resetChange() {
        this.lastChange = {
            word: '',
            precedingWord: null,
            original: '',
            tips: [],
            tipId: 0,
            coordinate: { left: 0, top: 0 },
            element: null,
            caret: { start: 0, end: 0 },
        };
    }
    onChange(callback) {
        this.eventListeners.onChange = callback;
    }
    turn(start = true) {
        if (start) {
            if (!this.isEnabled) {
                MongolianWritten.listener = (event) => this.onKeydown(event);
                document.addEventListener('keydown', MongolianWritten.listener);
                this.isEnabled = true;
            }
        }
        else {
            document.removeEventListener('keydown', MongolianWritten.listener);
            this.isEnabled = false;
            this.resetChange();
        }
    }
    emitChange() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const element = this.lastChange.element;
            if (!element) {
                return this.resetChange();
            }
            const selection = yield textareaSelection.getSelection(element);
            if (!selection) {
                return this.resetChange();
            }
            this.lastChange = {
                word: selection.current.word,
                precedingWord: (_a = selection === null || selection === void 0 ? void 0 : selection.preceding.word) !== null && _a !== void 0 ? _a : null,
                original: selection.current.word,
                tips: selection.current.word ? dictionary_1.Dictionary.getCandidates(selection.current.word, selection.preceding.word) : [],
                tipId: 0,
                coordinate: textareaSelection.coordinate(element),
                caret: { start: selection.current.start, end: selection.current.end },
                element,
            };
        });
    }
    emitEnter(event) {
        var _a, _b;
        const element = this.lastChange.element;
        const tipId = this.lastChange.tipId;
        const tipWord = (_b = (_a = this.lastChange.tips[tipId]) === null || _a === void 0 ? void 0 : _a.written) !== null && _b !== void 0 ? _b : undefined;
        if (tipWord) {
            event === null || event === void 0 ? void 0 : event.preventDefault();
            event === null || event === void 0 ? void 0 : event.stopPropagation();
            textareaSelection.insertText(`${tipWord} `, element, 'word');
            setTimeout(() => this.emitChange());
            return false;
        }
    }
    emitSpace(event, add = 1) {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.lastChange.tips.length > 0) {
                event.preventDefault();
                const element = this.lastChange.element;
                const selection = yield textareaSelection.getSelection(element);
                if (selection) {
                    const previousId = this.lastChange.tipId;
                    const previousTipWord = (_a = this.lastChange.tips[previousId]) === null || _a === void 0 ? void 0 : _a.written;
                    const nextTipIp = this.lastChange.tips[previousId + add] !== undefined ? previousId + add : 0;
                    const nextTipWord = (_b = this.lastChange.tips[nextTipIp]) === null || _b === void 0 ? void 0 : _b.written;
                    if (previousTipWord === selection.current.word) {
                        textareaSelection.insertText(nextTipWord, element, 'word');
                    }
                    const currentSelection = yield textareaSelection.getSelection(element);
                    this.lastChange = Object.assign(Object.assign({}, this.lastChange), { word: nextTipWord, tipId: nextTipIp, caret: (_c = currentSelection === null || currentSelection === void 0 ? void 0 : currentSelection.current) !== null && _c !== void 0 ? _c : { end: 0, start: 0 } });
                }
            }
        });
    }
    select(tipId) {
        const element = this.lastChange.element;
        element.focus();
        element.setSelectionRange(this.lastChange.caret.start, this.lastChange.caret.end);
        this.localLastChange.tipId = tipId;
        textareaSelection.insertText(`${this.lastChange.tips[tipId].written} `);
        this.resetChange();
    }
    insertMongolianWritten(event) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const keyword = event.key.toLowerCase();
            const element = this.lastChange.element;
            const selection = yield textareaSelection.getSelection(element);
            if ((selection === null || selection === void 0 ? void 0 : selection.current.word) === 'ᠯ' && (keyword === 'h' || keyword === 'х')) {
                textareaSelection.insertText('ᡀ', element, 'word');
            }
            else {
                textareaSelection.insertText(this.writtenKey(event));
            }
            this.emitChange();
        });
    }
    isConvertableKeys(ev) {
        const isShiftSpace = ev.key === ' ' && ev.shiftKey;
        return /^([a-zA-Zа-яА-Я]|ө|ү|Ө|Ү)$/.test(ev.key) || isShiftSpace;
    }
    isSpecialKeys(event) {
        return (event.ctrlKey && !event.metaKey) || (!event.ctrlKey && event.metaKey);
    }
    writtenKey(event) {
        var _a, _b;
        const lowerCaseKey = event.key.toLowerCase();
        const keyCode = `${event.shiftKey ? 'shift' : ''}${lowerCaseKey}`;
        return (_b = (_a = constants_1.KEY_MAP[keyCode]) !== null && _a !== void 0 ? _a : constants_1.KEY_MAP[lowerCaseKey]) !== null && _b !== void 0 ? _b : event.key;
    }
}
exports.default = MongolianWritten;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
MongolianWritten.listener = null;
//# sourceMappingURL=mongolianWritten.js.map