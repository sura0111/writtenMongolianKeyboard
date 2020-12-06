declare namespace WrittenMongol {
  namespace Keyboard {
    namespace Type {
      interface State {
        selectedWord: string
        selectedWordBeforeConversion: string
        wordBeforeSelectedWord: string
        element: HTMLInputElement | HTMLTextAreaElement | null
        conversions: WrittenMongol.DictionaryList
        conversionId: number
        coordinate: {
          left: number
          top: number
        }
        caret: {
          start: number
          end: number
        }
      }
    }
    namespace Event {
      interface Change {
        (event: Type.State): void
      }
      interface Switch {
        (isOn: boolean): void
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
