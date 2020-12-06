/// <reference types="./@types/namespaces" />
export declare class Dictionary {
    static maxConversions: number;
    private static generateConversionWords;
    private static cyrillic;
    private static alphabet;
    private static getConversionsFromType;
    private static getConversionsFromWritten;
    static getConversions(text: string, precedingWord?: string): WrittenMongol.DictionaryList;
}
