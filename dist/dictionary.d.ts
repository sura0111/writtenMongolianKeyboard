import { DictionaryList } from './definitions';
export declare class Dictionary {
    static maxConversions: number;
    static getConversions(text: string, precedingWord?: string): DictionaryList;
    private static alphabet;
    private static cyrillic;
    private static generateConversionWords;
    private static getConversionsFromType;
    private static getConversionsFromWritten;
}
