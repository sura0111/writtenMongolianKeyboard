/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { KEY_MAP } from './constants'
import { Dictionary } from './dictionary'
import TextAreaSelection from './textareaSelection'

export default class MongolianWritten {
  private isEnabled = false
  private localLastChange: MonWritten.Keyboard.Type.Change
  private onChangeListener: null | MonWritten.Keyboard.Event.Change

  private onKeydown = (event: KeyboardEvent) => {
    const element = this.selection.element(event.target)
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
    this.lastChange.coordinate = this.selection.coordinate(element)

    if (this.isConvertableKeys(event)) {
      this.insertMongolianWritten(event)
    }

    switch (event.key) {
      case 'Backspace':
        // this.textareaSelection.insertTextWithRemove(element, '', 'character')
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

  private selection: TextAreaSelection

  public constructor() {
    this.localLastChange = this.getDefaultChangeData()
    this.onChangeListener = null
    this.selection = new TextAreaSelection()
  }

  private get lastChange() {
    return this.localLastChange
  }

  private set lastChange(value) {
    this.localLastChange = value

    if (this.onChangeListener) {
      this.onChangeListener(value)
    }
  }

  public onChange(callback: MonWritten.Keyboard.Event.Change): void {
    this.onChangeListener = callback
  }

  public select(tipId: number): void {
    const element = this.lastChange.element!
    element.focus()
    element.setSelectionRange(this.lastChange.caret.start, this.lastChange.caret.end)
    this.localLastChange.tipId = tipId
    this.selection.insertText(`${this.lastChange.tips[tipId].written} `)
    this.resetChange()
  }

  public turn(start = true): void {
    if (start) {
      if (!this.isEnabled) {
        document.addEventListener('keydown', this.onKeydown)
        this.isEnabled = true
      }
    } else {
      document.removeEventListener('keydown', this.onKeydown)
      this.isEnabled = false
      this.resetChange()
    }
  }

  private async emitChange() {
    const element = this.lastChange.element
    if (!element) {
      return this.resetChange()
    }
    const selection = await this.selection.getSelection(element)
    if (!selection) {
      return this.resetChange()
    }

    this.lastChange = {
      word: selection.current.word,
      precedingWord: selection?.preceding.word ?? null,
      original: selection.current.word,
      tips: selection.current.word ? Dictionary.getCandidates(selection.current.word, selection.preceding.word) : [],
      tipId: 0,
      coordinate: this.selection.coordinate(element),
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
      this.selection.insertText(`${tipWord} `, element, 'word')
      setTimeout(() => this.emitChange())
      return false
    }
  }

  private async emitSpace(event: KeyboardEvent, add: 1 | -1 = 1) {
    if (this.lastChange.tips.length > 0) {
      event.preventDefault()
      const element = this.lastChange.element!
      const selection = await this.selection.getSelection(element)

      if (selection) {
        const previousId = this.lastChange.tipId
        const previousTipWord = this.lastChange.tips[previousId]?.written
        const nextTipIp = this.lastChange.tips[previousId + add] !== undefined ? previousId + add : 0
        const nextTipWord = this.lastChange.tips[nextTipIp]?.written

        if (previousTipWord === selection.current.word) {
          this.selection.insertText(nextTipWord, element, 'word')
        }

        const currentSelection = await this.selection.getSelection(element)

        this.lastChange = {
          ...this.lastChange,
          word: nextTipWord,
          tipId: nextTipIp,
          caret: currentSelection?.current ?? { end: 0, start: 0 },
        }
      }
    }
  }

  private async insertMongolianWritten(event: KeyboardEvent) {
    event.preventDefault()
    const keyword = event.key.toLowerCase()
    const element = this.lastChange.element!
    const selection = await this.selection.getSelection(element)
    if (selection?.current.word === 'ᠯ' && (keyword === 'h' || keyword === 'х')) {
      this.selection.insertText('ᡀ', element, 'word')
    } else {
      this.selection.insertText(this.writtenKey(event))
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

  private getDefaultChangeData() {
    return {
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

  private resetChange() {
    this.lastChange = this.getDefaultChangeData()
  }

  private writtenKey(event: { key: string; shiftKey: boolean }) {
    const lowerCaseKey = event.key.toLowerCase()
    const keyCode = `${event.shiftKey ? 'shift' : ''}${lowerCaseKey}`
    return KEY_MAP[keyCode] ?? KEY_MAP[lowerCaseKey] ?? event.key
  }
}
