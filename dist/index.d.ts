/// <reference types="./src/@types/namespaces" />
export default class WrittenMongolKeyboard {
    private static ACCEPTED_TAG_NAMES;
    private static EVENT_TYPE;
    private _change;
    private hasPredefinedElement;
    private hasBuiltInConversionView;
    private builtInView;
    private localSwitch;
    private main;
    private onChangeListener;
    private onSwitchListener;
    private predefinedElement?;
    constructor(target?: HTMLInputElement | HTMLTextAreaElement, options?: {
        hasBuiltInConversionView: boolean;
        maxConversions: number;
    });
    get switch(): boolean;
    set switch(value: boolean);
    private get coordinate();
    private get element();
    private get mainElement();
    private get state();
    private set state(value);
    onChange(callback: WrittenMongol.Keyboard.Event.Change): void;
    onSwitch(callback: WrittenMongol.Keyboard.Event.Switch): void;
    selectConversion(conversionId: number): Promise<void>;
    private static getAcceptedElement;
    private changeConversion;
    private confirmConversion;
    private convertKey;
    private getConvertedKey;
    private getDefaultState;
    private getSelectionAfterInput;
    private getSelectionBeforeInput;
    /**
     * @description by default it inserts space after the text insertion
     */
    private insertTextAtSelection;
    private isConvertableKeys;
    private isSpecialKeys;
    private resetState;
    private updateState;
    private removeCharacterBeforeSelection;
}
