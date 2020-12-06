/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { KEY_MAP } from '@/constants'
import { Dictionary } from '@/dictionary'
import TextAreaSelection from '@/textareaSelection'

const textareaSelection = new TextAreaSelection()

export default class MongolianWritten {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static listener: any = null
  private isEnabled = false
  private localLastChange: MonWritten.Keyboard.Type.Change = {
    word: '',
    precedingWord: null,
    original: '',
    tips: [],
    tipId: 0,
    coordinate: { left: 0, top: 0 },
    element: null,
    caret: { start: 0, end: 0 },
  }

  private get lastChange() {
    return this.localLastChange
  }

  private set lastChange(value) {
    this.localLastChange = value
    console.log(value)
    if (this.eventListeners.onChange) {
      this.eventListeners.onChange(value)
    }
  }

  resetChange() {
    this.lastChange = {
      word: '',
      precedingWord: null,
      original: '',
      tips: [],
      tipId: 0,
      coordinate: { left: 0, top: 0 },
      element: null,
      caret: { start: 0, end: 0 },
    }
  }

  private onKeydown = (event: KeyboardEvent) => {
    const element = textareaSelection.element(event.target)
    if (
      !this.isEnabled ||
      !element ||
      (this.lastChange.element && this.lastChange.element.textContent !== element.textContent) ||
      this.isSpecialKeys(event)
    ) {
      this.resetChange()
      return
    }

    this.lastChange.element = element
    this.lastChange.coordinate = textareaSelection.coordinate(element)

    if (this.isConvertableKeys(event)) {
      this.insertMongolianWritten(event)
    }

    switch (event.key) {
      case 'Backspace':
        // textareaSelection.insertTextWithRemove(element, '', 'character')
        this.emitChange()
        return
      case ' ':
      case 'ArrowLeft':
      case 'ArrowRight':
        return this.emitSpace(event, event.key === 'ArrowLeft' ? -1 : 1)
      case 'Enter':
        return this.emitEnter(event)
      default:
        break
    }
  }

  private eventListeners = {
    onChange: null as null | MonWritten.Keyboard.Event.Change,
  }

  public onChange(callback: MonWritten.Keyboard.Event.Change) {
    this.eventListeners.onChange = callback
  }

  public turn(start = true) {
    if (start) {
      if (!this.isEnabled) {
        MongolianWritten.listener = (event: KeyboardEvent) => this.onKeydown(event)
        document.addEventListener('keydown', MongolianWritten.listener)
        this.isEnabled = true
      }
    } else {
      document.removeEventListener('keydown', MongolianWritten.listener)
      this.isEnabled = false
      this.resetChange()
    }
  }

  private async emitChange() {
    const element = this.lastChange.element
    if (!element) {
      return this.resetChange()
    }
    const selection = await textareaSelection.getSelection(element)
    if (!selection) {
      return this.resetChange()
    }

    this.lastChange = {
      word: selection.current.word,
      precedingWord: selection?.preceding.word ?? null,
      original: selection.current.word,
      tips: selection.current.word ? Dictionary.getCandidates(selection.current.word, selection.preceding.word) : [],
      tipId: 0,
      coordinate: textareaSelection.coordinate(element),
      caret: { start: selection.current.start, end: selection.current.end },
      element,
    }
  }

  private emitEnter(event?: KeyboardEvent) {
    const element = this.lastChange.element!
    const tipId = this.lastChange.tipId
    const tipWord = this.lastChange.tips[tipId]?.written ?? undefined

    if (tipWord) {
      event?.preventDefault()
      event?.stopPropagation()
      textareaSelection.insertText(`${tipWord} `, element, 'word')
      setTimeout(() => this.emitChange())
      return false
    }
  }

  private async emitSpace(event: KeyboardEvent, add: 1 | -1 = 1) {
    if (this.lastChange.tips.length > 0) {
      event.preventDefault()
      const element = this.lastChange.element!
      const selection = await textareaSelection.getSelection(element)

      if (selection) {
        const previousId = this.lastChange.tipId
        const previousTipWord = this.lastChange.tips[previousId]?.written
        const nextTipIp = this.lastChange.tips[previousId + add] !== undefined ? previousId + add : 0
        const nextTipWord = this.lastChange.tips[nextTipIp]?.written

        if (previousTipWord === selection.current.word) {
          textareaSelection.insertText(nextTipWord, element, 'word')
        }

        const currentSelection = await textareaSelection.getSelection(element)

        this.lastChange = {
          ...this.lastChange,
          word: nextTipWord,
          tipId: nextTipIp,
          caret: currentSelection?.current ?? { end: 0, start: 0 },
        }
      }
    }
  }

  public async select(tipId: number) {
    const element = this.lastChange.element!
    element.focus()
    element.setSelectionRange(this.lastChange.caret.start, this.lastChange.caret.end)
    this.localLastChange.tipId = tipId
    textareaSelection.insertText(`${this.lastChange.tips[tipId].written} `)
    this.resetChange()
  }

  private async insertMongolianWritten(event: KeyboardEvent) {
    event.preventDefault()
    const keyword = event.key.toLowerCase()
    const element = this.lastChange.element!
    const selection = await textareaSelection.getSelection(element)
    if (selection?.current.word === 'ᠯ' && (keyword === 'h' || keyword === 'х')) {
      textareaSelection.insertText('ᡀ', element, 'word')
    } else {
      textareaSelection.insertText(this.writtenKey(event))
    }
    this.emitChange()
  }

  private isConvertableKeys(ev: KeyboardEvent) {
    const isShiftSpace = ev.key === ' ' && ev.shiftKey
    return /^([a-zA-Zа-яА-Я]|ө|ү|Ө|Ү)$/.test(ev.key) || isShiftSpace
  }

  private isSpecialKeys(event: KeyboardEvent) {
    return (event.ctrlKey && !event.metaKey) || (!event.ctrlKey && event.metaKey)
  }

  private writtenKey(event: { key: string; shiftKey: boolean }) {
    const lowerCaseKey = event.key.toLowerCase()
    const keyCode = `${event.shiftKey ? 'shift' : ''}${lowerCaseKey}`
    return KEY_MAP[keyCode] ?? KEY_MAP[lowerCaseKey] ?? event.key
  }
}
