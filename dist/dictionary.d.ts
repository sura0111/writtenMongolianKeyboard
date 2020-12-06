export declare class Dictionary {
    private static maxCandidatesPerType;
    private static generateCandidateWords;
    private static cyrillic;
    private static alphabet;
    private static getCandidatesFromType;
    private static getCandidatesFromWritten;
    static getCandidates(text: string, precedingWord?: string): MonWritten.DictionaryList;
}
