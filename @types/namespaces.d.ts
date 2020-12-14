// nothing in here
declare namespace surakh {
  interface Selection extends globalThis.Selection {
    modify(
      alter: 'move' | 'extend',
      direction: 'forward' | 'backward' | 'left' | 'right',
      granularity:
        | 'character'
        | 'word'
        | 'sentence'
        | 'line'
        | 'paragraph'
        | 'lineboundary'
        | 'sentenceboundary'
        | 'paragraphboundary'
        | 'documentboundary',
    ): void
  }
}
