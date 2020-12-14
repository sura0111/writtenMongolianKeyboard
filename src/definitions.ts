export interface DictionaryItem {
  cyrillic: string
  latin: string
  traditional: string
}

export type DictionaryList = DictionaryItem[]

export interface ConversionViewParameter {
  coordinate: {
    left: number
    top: number
  }
  conversionId: number
  conversions: DictionaryList
}

export interface EditableState extends ConversionViewParameter {
  savedSelection: { start: number; end: number } | null
}

export interface KeyChangeState extends ConversionViewParameter {
  selectedWord: string
  selectedWordBeforeConversion: string
  wordBeforeSelectedWord: string
  element: HTMLInputElement | HTMLTextAreaElement | null
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
