"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const constants_1 = require("./constants");
const dictionary_1 = require("./dictionary");
const textarea_caret_1 = tslib_1.__importDefault(require("textarea-caret"));
const index_1 = require("./constants/index");
const builtInConversionHtml_1 = tslib_1.__importDefault(require("./builtInConversionHtml"));
const builtInConversionStyle_1 = tslib_1.__importDefault(require("./builtInConversionStyle"));
class WrittenMongolKeyboard {
    constructor(target, options) {
        var _a;
        this.builtInView = null;
        this.localSwitch = false;
        this.main = (event) => {
            var _a;
            const element = WrittenMongolKeyboard.getAcceptedElement(event);
            const isPreviousElement = !this.state.element || this.state.element.value === (element === null || element === void 0 ? void 0 : element.value);
            const canProceed = this.switch && element && isPreviousElement && !this.isSpecialKeys(event);
            if (this.isSpecialKeys(event) && (event.key === 'm' || event.key === 'т')) {
                event.preventDefault();
                this.resetState();
                this.switch = !this.switch;
                console.log(this.switch);
                return;
            }
            if (!canProceed) {
                return this.resetState();
            }
            this.state.element = (_a = this.element) !== null && _a !== void 0 ? _a : element;
            this.state.coordinate = this.coordinate;
            if (this.isConvertableKeys(event)) {
                event.preventDefault();
                this.convertKey(event);
                this.updateState();
                return;
            }
            switch (event.key) {
                case 'Backspace':
                    this.removeCharacterBeforeSelection().then(() => this.updateState());
                    return;
                case ' ':
                case 'ArrowLeft':
                case 'ArrowRight':
                    return this.changeConversion(event, event.key === 'ArrowLeft' ? -1 : 1);
                case 'Enter':
                    const preventDefault = this.confirmConversion();
                    if (preventDefault) {
                        event.preventDefault();
                        return false;
                    }
                default:
                    break;
            }
        };
        this._change = this.getDefaultState();
        this.onChangeListener = () => undefined;
        this.onSwitchListener = () => undefined;
        this.predefinedElement = target;
        this.hasPredefinedElement = target !== undefined;
        this.mainElement.addEventListener(WrittenMongolKeyboard.EVENT_TYPE, this.main);
        this.hasBuiltInConversionView =
            (options === null || options === void 0 ? void 0 : options.hasBuiltInConversionView) !== undefined ? options.hasBuiltInConversionView : true;
        dictionary_1.Dictionary.maxConversions = (_a = options === null || options === void 0 ? void 0 : options.maxConversions) !== null && _a !== void 0 ? _a : 8;
        if (this.hasBuiltInConversionView) {
            const div = document.createElement('div');
            div.id = 'writtenMongolKeyboard';
            this.builtInView = div;
            document.body.appendChild(div);
            const style = document.createElement('style');
            style.innerHTML = builtInConversionStyle_1.default;
            document.head.appendChild(style);
        }
    }
    get switch() {
        return this.localSwitch;
    }
    set switch(value) {
        this.localSwitch = value;
        this.resetState();
        this.onSwitchListener(value);
    }
    get coordinate() {
        var _a;
        const element = this.element;
        const container = element.getBoundingClientRect();
        const { left, top } = textarea_caret_1.default(element, (_a = element.selectionEnd) !== null && _a !== void 0 ? _a : 0);
        return { left: container.left + left, top: container.top + top };
    }
    get element() {
        return this.hasPredefinedElement ? this.predefinedElement : this.state.element;
    }
    get mainElement() {
        return (this.hasPredefinedElement ? this.predefinedElement : document);
    }
    get state() {
        return this._change;
    }
    set state(value) {
        this.onChangeListener(value);
        if (this.builtInView) {
            this.builtInView.innerHTML = builtInConversionHtml_1.default(value);
            document.querySelectorAll('.writtenMongolKeyboardConversions_item').forEach((div) => {
                const selection = (id) => this.selectConversion(id);
                div.addEventListener('click', function () {
                    const id = Number(this.getAttribute('data-id'));
                    console.log(id);
                    selection(id);
                });
            });
        }
        this._change = value;
    }
    onChange(callback) {
        this.onChangeListener = callback;
    }
    selectConversion(conversionId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.element.focus();
            this.element.setSelectionRange(this.state.caret.start, this.state.caret.end);
            this._change.conversionId = conversionId;
            yield this.insertTextAtSelection(this.state.conversions[conversionId].written);
            this.resetState();
        });
    }
    static getAcceptedElement(event) {
        const element = event.target;
        return WrittenMongolKeyboard.ACCEPTED_TAG_NAMES.includes(element === null || element === void 0 ? void 0 : element.tagName)
            ? element
            : null;
    }
    changeConversion(event, add = 1) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.state.conversions.length > 0) {
                event.preventDefault();
                const tempConversionId = this.state.conversionId + add;
                const conversionId = this.state.conversions[tempConversionId] !== undefined ? tempConversionId : 0;
                const selectedWord = (_a = this.state.conversions[conversionId]) === null || _a === void 0 ? void 0 : _a.written;
                this.insertTextAtSelection(selectedWord, { removePattern: 'word', insertSpace: false });
                const selection = yield this.getSelectionAfterInput();
                if (!selection) {
                    return this.resetState();
                }
                this.state = Object.assign(Object.assign({}, this.state), { selectedWord,
                    conversionId, caret: selection.caret });
            }
        });
    }
    confirmConversion() {
        var _a, _b;
        const conversionId = this.state.conversionId;
        const conversionWord = (_b = (_a = this.state.conversions[conversionId]) === null || _a === void 0 ? void 0 : _a.written) !== null && _b !== void 0 ? _b : undefined;
        if (conversionWord) {
            this.insertTextAtSelection(conversionWord, { removePattern: 'word' }).then(() => this.resetState());
            return true;
        }
        this.resetState();
        return false;
    }
    convertKey(event) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const keyword = event.key.toLowerCase();
            const selection = this.getSelectionBeforeInput();
            // convert 'lh' or 'лх' to 'ᡀ' if the word is started with it
            if ((selection === null || selection === void 0 ? void 0 : selection.selectedWord) === 'ᠯ' && (keyword === 'h' || keyword === 'х')) {
                this.insertTextAtSelection('ᡀ', { removePattern: 'word', insertSpace: false });
                return;
            }
            this.insertTextAtSelection(this.getConvertedKey(event), { insertSpace: false });
        });
    }
    getConvertedKey(event) {
        var _a, _b;
        const lowerCaseKey = event.key.toLowerCase();
        const keyCode = `${event.shiftKey ? 'shift' : ''}${lowerCaseKey}`;
        return (_b = (_a = constants_1.KEY_MAP[keyCode]) !== null && _a !== void 0 ? _a : constants_1.KEY_MAP[lowerCaseKey]) !== null && _b !== void 0 ? _b : event.key;
    }
    getDefaultState() {
        var _a;
        return {
            selectedWord: '',
            selectedWordBeforeConversion: '',
            wordBeforeSelectedWord: '',
            conversionId: 0,
            conversions: [],
            element: (_a = this.predefinedElement) !== null && _a !== void 0 ? _a : null,
            coordinate: { left: 0, top: 0 },
            caret: { start: 0, end: 0 },
        };
    }
    getSelectionAfterInput() {
        return new Promise((resolve) => {
            setTimeout(() => resolve(this.getSelectionBeforeInput()));
        });
    }
    getSelectionBeforeInput() {
        var _a;
        const { selectionEnd, selectionStart, value } = (_a = this.element) !== null && _a !== void 0 ? _a : {};
        const isCollapsed = selectionStart === selectionEnd;
        if (!selectionEnd || !selectionStart || !isCollapsed) {
            return null;
        }
        // TODO: make more simple
        const startIndex = value.substr(0, selectionStart).replace(/\n/, ' ').split(' ').slice(0, -1).join(' ').length;
        const endIndex = value.substr(selectionStart).replace(/\n/, ' ').split(' ').slice(0, 1)[0].length;
        const end = endIndex < 1 ? value.length : selectionStart + endIndex;
        const precedingText = value.substring(0, startIndex);
        const currentWord = value.substring(startIndex, end);
        const selectedWord = currentWord.trim();
        const wordBeforeSelectedWord = precedingText.replace(/^.+\s/, '');
        const start = currentWord.indexOf(' ') === 0 ? startIndex + 1 : startIndex;
        const data = {
            selectedWord,
            caret: {
                start,
                end,
            },
            element: this.element,
            wordBeforeSelectedWord: precedingText.replace(/^.+\s/, ''),
            textBeforeSelectedWord: precedingText,
            coordinate: this.coordinate,
            conversions: selectedWord ? dictionary_1.Dictionary.getConversions(selectedWord, wordBeforeSelectedWord) : [],
        };
        return data;
    }
    /**
     * @description by default it inserts space after the text insertion
     */
    insertTextAtSelection(inputText, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const insertSpaceAfter = (options === null || options === void 0 ? void 0 : options.insertSpace) !== undefined ? options.insertSpace : true;
            const removePattern = options === null || options === void 0 ? void 0 : options.removePattern;
            const { selectionEnd, selectionStart } = this.element;
            const text = insertSpaceAfter ? `${inputText} ` : inputText;
            if (selectionEnd === null || selectionStart === null) {
                return;
            }
            if (removePattern === undefined) {
                return document.execCommand('insertText', false, text);
            }
            if (removePattern === 'character') {
                this.element.setSelectionRange(Math.max(selectionStart - 1, 0), selectionEnd);
                document.execCommand('insertText', false, text);
                return;
            }
            const selection = yield this.getSelectionAfterInput();
            if (!selection) {
                return;
            }
            if (removePattern === 'word') {
                this.element.setSelectionRange(selection.caret.start, selection.caret.end);
                document.execCommand('insertText', false, text);
                return;
            }
            const start = selection.textBeforeSelectedWord.replace(removePattern, '').length;
            this.element.setSelectionRange(start, selection.caret.end);
            document.execCommand('insertText', false, text);
        });
    }
    isConvertableKeys(ev) {
        const isShiftSpace = ev.key === ' ' && ev.shiftKey;
        return /^([a-zA-Zа-яА-Я]|ө|ү|Ө|Ү)$/.test(ev.key) || isShiftSpace;
    }
    isSpecialKeys(event) {
        return (event.ctrlKey && !event.metaKey) || (!event.ctrlKey && event.metaKey);
    }
    resetState() {
        this.state = this.getDefaultState();
    }
    updateState() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const selection = yield this.getSelectionAfterInput();
            if (!selection) {
                return this.resetState();
            }
            this.state = Object.assign(Object.assign({}, selection), { selectedWordBeforeConversion: selection.selectedWord, conversionId: 0 });
        });
    }
    removeCharacterBeforeSelection() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const selection = yield this.getSelectionAfterInput();
            if ((selection === null || selection === void 0 ? void 0 : selection.selectedWord.substr(-1)) === index_1.WRITTEN_MONGOL_KEY.connector) {
                this.insertTextAtSelection('', { removePattern: 'character', insertSpace: false });
            }
        });
    }
}
exports.default = WrittenMongolKeyboard;
WrittenMongolKeyboard.ACCEPTED_TAG_NAMES = ['TEXTAREA', 'INPUT'];
WrittenMongolKeyboard.EVENT_TYPE = 'keydown';
//# sourceMappingURL=index.js.map