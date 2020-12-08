export interface DictionaryItem {
  cyrillic: string
  latin: string
  traditional: string
}

export type DictionaryList = DictionaryItem[]

export interface KeyChangeState {
  selectedWord: string
  selectedWordBeforeConversion: string
  wordBeforeSelectedWord: string
  element: HTMLInputElement | HTMLTextAreaElement | null
  conversions: DictionaryList
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

export interface KeyChangeEvent {
  (state: KeyChangeState): void
}

export interface SwitchEvent {
  (isOn: boolean): void
}
