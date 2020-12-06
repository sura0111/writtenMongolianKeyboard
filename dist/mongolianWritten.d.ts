/// <reference types="./src/@types/namespaces" />
export default class MongolianWritten {
    private static listener;
    private isEnabled;
    private localLastChange;
    private get lastChange();
    private set lastChange(value);
    private resetChange;
    private onKeydown;
    private eventListeners;
    onChange(callback: MonWritten.Keyboard.Event.Change): void;
    turn(start?: boolean): void;
    private emitChange;
    private emitEnter;
    private emitSpace;
    select(tipId: number): void;
    private insertMongolianWritten;
    private isConvertableKeys;
    private isSpecialKeys;
    private writtenKey;
}
