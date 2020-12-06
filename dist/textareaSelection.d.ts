declare type Target = HTMLInputElement | HTMLTextAreaElement;
export default class TextAreaSelection {
    element(target?: HTMLElement | EventTarget | null): Target | null;
    coordinate(target: Target): {
        left: number;
        top: number;
    } | null;
    insertText(text: string, target?: Target, remove?: 'word' | 'character' | RegExp): Promise<boolean | undefined>;
    private selection;
    getSelection(target: Target): Promise<{
        element: Target;
        current: {
            word: string;
            start: number;
            end: number;
        };
        preceding: {
            word: string;
            text: string;
        };
    } | null>;
}
export {};
