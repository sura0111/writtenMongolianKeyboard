/// <reference types="./src/@types/namespaces" />
export default class MongolianWritten {
    private isEnabled;
    private localLastChange;
    private onChangeListener;
    private onKeydown;
    private selection;
    constructor();
    private get lastChange();
    private set lastChange(value);
    onChange(callback: MonWritten.Keyboard.Event.Change): void;
    select(tipId: number): void;
    turn(start?: boolean): void;
    private emitChange;
    private emitEnter;
    private emitSpace;
    private insertMongolianWritten;
    private isConvertableKeys;
    private isSpecialKeys;
    private getDefaultChangeData;
    private resetChange;
    private writtenKey;
}
