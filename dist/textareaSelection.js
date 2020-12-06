"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const textarea_caret_1 = tslib_1.__importDefault(require("textarea-caret"));
class TextAreaSelection {
    element(target) {
        var _a, _b;
        return ['TEXTAREA', 'INPUT'].includes((_b = (_a = target) === null || _a === void 0 ? void 0 : _a.tagName) !== null && _b !== void 0 ? _b : '') ? target : null;
    }
    coordinate(target) {
        var _a;
        const element = this.element(target);
        if (!element) {
            return null;
        }
        const localCoordinate = textarea_caret_1.default(element, (_a = element.selectionEnd) !== null && _a !== void 0 ? _a : 0);
        const frame = element.getBoundingClientRect();
        return {
            left: frame.left + localCoordinate.left,
            top: frame.top + localCoordinate.top,
        };
    }
    insertText(text, target, remove) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!remove) {
                document.execCommand('insertText', false, text);
                return;
            }
            const element = this.element(target);
            if (!element || !element.selectionStart || !element.selectionEnd) {
                return;
            }
            const { selectionEnd, selectionStart } = element;
            if (remove === 'character') {
                element.setSelectionRange(Math.max(selectionStart - 1, 0), selectionEnd);
                this.insertText(text);
                return;
            }
            const selection = yield this.getSelection(element);
            if (selection) {
                if (remove === 'word') {
                    element.setSelectionRange(selection.current.start, selection.current.end);
                    this.insertText(text);
                    return;
                }
                const start = selection.preceding.text.replace(remove, '').length;
                element.setSelectionRange(start, selection.current.end);
                this.insertText(text);
            }
        });
    }
    selection(element) {
        const { selectionEnd, selectionStart, value } = element;
        if (!selectionStart || selectionStart !== selectionEnd) {
            return null;
        }
        const start = value.substr(0, selectionStart).replace(/\n/, ' ').split(' ').slice(0, -1).join(' ').length;
        const endIndex = value.substr(selectionStart).replace(/\n/, ' ').split(' ').slice(0, 1)[0].length;
        const end = endIndex < 1 ? value.length : selectionStart + endIndex;
        const precedingText = value.substring(0, start);
        const currentWord = value.substring(start, end);
        return {
            element,
            current: {
                word: currentWord.trim(),
                start: currentWord.indexOf(' ') === 0 ? start + 1 : start,
                end,
            },
            preceding: {
                word: precedingText.replace(/^.+\s/, ''),
                text: precedingText,
            },
        };
    }
    getSelection(target) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(this.selection(target)));
        });
    }
}
exports.default = TextAreaSelection;
//# sourceMappingURL=textareaSelection.js.map