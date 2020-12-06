declare namespace MonWritten {
  namespace Keyboard {
    namespace Type {
      interface Change {
        word: string
        original: string
        precedingWord: string | null
        tips: MonWritten.DictionaryList
        tipId: number
        coordinate: {
          left: number
          top: number
        } | null
        element: HTMLInputElement | HTMLTextAreaElement | null
        caret: {
          start: number
          end: number
        }
      }
    }
    namespace Event {
      interface Change {
        (event: Type.Change): void
      }
    }
  }

  interface DictionaryItem {
    cyrillic?: string
    latin_direct?: string
    description?: string
    written: string
    'phonetic transcription'?: string
  }

  type DictionaryList = DictionaryItem[]
}
