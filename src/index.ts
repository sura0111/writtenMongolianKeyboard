/* eslint-disable @typescript-eslint/no-non-null-assertion */
import textareaCaret from 'textarea-caret'

import builtInConversionHtml from '@/builtInConversionHtml'
import builtInConversionStyle from '@/builtInConversionStyle'
import { KEY_MAP, KEY } from '@/database'
import { DictionaryList, KeyChangeEvent, KeyChangeState, SwitchEvent } from '@/definitions'
import { Dictionary } from '@/dictionary'

export default class WrittenMongolKeyboard {
  private static ACCEPTED_TAG_NAMES: (string | null | undefined)[] = ['TEXTAREA', 'INPUT']
  private static EVENT_TYPE: 'keydown' = 'keydown'

  private _change: KeyChangeState
  private builtInView: HTMLDivElement | null = null
  private hasBuiltInConversionView: boolean
  private hasPredefinedElement: boolean
  private localSwitch = false
  private main = (event: KeyboardEvent) => {
    const element = WrittenMongolKeyboard.getAcceptedElement(event)
    const isPreviousElement = !this.state.element || this.state.element.value === element?.value
    const canProceed = this.switch && element && isPreviousElement && !this.isSpecialKeys(event)

    if (this.isSpecialKeys(event) && (event.key === 'm' || event.key === 'т')) {
      event.preventDefault()
      this.resetState()
      this.switch = !this.switch
      return
    }

    if (!canProceed) {
      return this.resetState()
    }

    this.state.element = this.element ?? element
    this.state.coordinate = this.coordinate

    if (this.isConvertableKeys(event)) {
      event.preventDefault()
      this.convertKey(event)
      this.updateState()
      return
    }

    switch (event.key) {
      case 'Backspace':
        event.preventDefault()
        this.removeCharacterBeforeSelection().then(() => this.updateState())
        return
      case ' ':
      case 'ArrowLeft':
      case 'ArrowRight':
        return this.changeConversion(event, event.key === 'ArrowLeft' ? -1 : 1)
      case 'Enter':
        const preventDefault = this.confirmConversion()
        if (preventDefault) {
          event.preventDefault()
          return false
        }
      default:
        break
    }
  }

  private onChangeListener: KeyChangeEvent
  private onSwitchListener: SwitchEvent
  private predefinedElement?: HTMLInputElement | HTMLTextAreaElement

  public constructor(
    target?: HTMLInputElement | HTMLTextAreaElement,
    options?: { hasBuiltInConversionView: boolean; maxConversions: number },
  ) {
    this._change = this.getDefaultState()
    this.onChangeListener = () => undefined
    this.onSwitchListener = () => undefined
    this.predefinedElement = target
    this.hasPredefinedElement = target !== undefined
    this.mainElement.addEventListener(WrittenMongolKeyboard.EVENT_TYPE, this.main)
    this.hasBuiltInConversionView =
      options?.hasBuiltInConversionView !== undefined ? options.hasBuiltInConversionView : true
    Dictionary.maxConversions = options?.maxConversions ?? 8
    if (this.hasBuiltInConversionView) {
      const div = document.createElement('div')
      div.id = 'writtenMongolKeyboard'
      this.builtInView = div
      document.body.appendChild(div)

      const style = document.createElement('style')
      style.innerHTML = builtInConversionStyle
      document.head.appendChild(style)
    }
  }

  public get switch(): boolean {
    return this.localSwitch
  }

  public set switch(value: boolean) {
    this.localSwitch = value
    this.resetState()
    this.onSwitchListener(value)
  }

  private get coordinate(): { left: number; top: number } {
    const element = this.element
    const container = element.getBoundingClientRect()
    const { left, top } = textareaCaret(element, element.selectionEnd ?? 0)
    return { left: container.left + left, top: container.top + top }
  }

  private get element() {
    return this.hasPredefinedElement ? this.predefinedElement! : this.state.element!
  }

  private get mainElement(): HTMLElement {
    return (this.hasPredefinedElement ? this.predefinedElement : document) as HTMLElement
  }

  private get state() {
    return this._change
  }

  private set state(value) {
    this.onChangeListener(value)
    if (this.builtInView) {
      this.builtInView.innerHTML = builtInConversionHtml(value)
      document.querySelectorAll('.writtenMongolKeyboardConversions_item').forEach((div) => {
        const selection = (id: number) => this.selectConversion(id)
        ;(div as HTMLDivElement).addEventListener('click', function () {
          const id = Number(this.getAttribute('data-id'))
          selection(id)
        })
      })
    }
    this._change = value
  }

  public onChange(callback: KeyChangeEvent): void {
    this.onChangeListener = callback
  }

  public onSwitch(callback: SwitchEvent): void {
    this.onSwitchListener = callback
  }

  public async selectConversion(conversionId: number): Promise<void> {
    this.element.focus()
    this.element.setSelectionRange(this.state.caret.start, this.state.caret.end)
    this._change.conversionId = conversionId
    await this.insertTextAtSelection(this.state.conversions[conversionId].traditional)
    this.resetState()
  }

  private static getAcceptedElement(event: KeyboardEvent) {
    const element = event.target as HTMLElement | null
    return WrittenMongolKeyboard.ACCEPTED_TAG_NAMES.includes(element?.tagName)
      ? (element as HTMLInputElement | HTMLTextAreaElement)
      : null
  }

  private async changeConversion(event: KeyboardEvent, add: 1 | -1 = 1) {
    if (this.state.conversions.length > 0) {
      event.preventDefault()

      const tempConversionId = this.state.conversionId + add
      const conversionId = this.state.conversions[tempConversionId] !== undefined ? tempConversionId : 0
      const selectedWord = this.state.conversions[conversionId]?.traditional

      this.insertTextAtSelection(selectedWord, { remove: 'word' })
      const selection = await this.getSelectionAfterInput()

      if (!selection) {
        return this.resetState()
      }

      this.state = {
        ...this.state,
        selectedWord,
        conversionId,
        caret: selection.caret,
      }
    }
  }

  private confirmConversion() {
    const conversionId = this.state.conversionId
    const conversionWord = this.state.conversions[conversionId]?.traditional ?? undefined

    if (conversionWord) {
      this.insertTextAtSelection(conversionWord, { remove: 'word' }).then(() => this.resetState())
      return true
    }

    this.resetState()
    return false
  }

  private async convertKey(event: { key: string; shiftKey: boolean }) {
    const keyword = event.key.toLowerCase()
    const selection = this.getSelectionBeforeInput()

    // convert 'lh' or 'лх' to 'ᡀ' if the word is started with it
    if (selection?.selectedWord === 'ᠯ' && (keyword === 'h' || keyword === 'х')) {
      this.insertTextAtSelection('ᡀ', { remove: 'word' })
      return
    }

    this.insertTextAtSelection(this.getConvertedKey(event))
  }

  private getConvertedKey(event: { key: string; shiftKey: boolean }) {
    const lowerCaseKey = event.key.toLowerCase()
    const keyCode = `${event.shiftKey ? 'shift' : ''}${lowerCaseKey}`
    return KEY_MAP[keyCode] ?? KEY_MAP[lowerCaseKey] ?? event.key
  }

  private getDefaultState(): KeyChangeState {
    return {
      selectedWord: '',
      selectedWordBeforeConversion: '',
      wordBeforeSelectedWord: '',
      conversionId: 0,
      conversions: [],
      element: this.predefinedElement ?? null,
      coordinate: { left: 0, top: 0 },
      caret: { start: 0, end: 0 },
    }
  }

  private getSelectionAfterInput(): Promise<{
    selectedWord: string
    caret: { start: number; end: number }
    element: HTMLTextAreaElement | HTMLInputElement
    wordBeforeSelectedWord: string
    textBeforeSelectedWord: string
    textBeforeSelection: string
    coordinate: { left: number; top: number }
    conversions: DictionaryList
  } | null> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.getSelectionBeforeInput()))
    })
  }

  private getSelectionBeforeInput() {
    const { selectionEnd, selectionStart, value } = this.element ?? {}
    const isCollapsed = selectionStart === selectionEnd

    if (!selectionEnd || !selectionStart || !isCollapsed) {
      return null
    }

    const textBeforeSelection = value.substr(0, selectionStart)
    const textAfterSelection = value.substr(selectionStart)

    const start = textBeforeSelection.replace(/([^\s\n]|\w|[\u1800-\u18AF])+$/, '').length
    const end = selectionEnd + (textAfterSelection.match(/^([^\s\n]|\w|[\u1800-\u18AF])+/) ?? [''])[0].length

    const textBeforeSelectedWord = value.slice(0, start).trimEnd()
    const selectedWord = value.substr(start, end)
    const wordBeforeSelectedWord = textBeforeSelectedWord.replace(/^.+\s/, '')
    const { element, coordinate } = this
    const conversions = selectedWord ? Dictionary.getConversions(selectedWord, wordBeforeSelectedWord) : []

    const data = {
      selectedWord,
      caret: {
        start,
        end,
      },
      element,
      wordBeforeSelectedWord,
      textBeforeSelectedWord,
      textBeforeSelection,
      coordinate,
      conversions,
    }

    return data
  }

  /**
   * @description by default it inserts space after the text insertion
   */
  private async insertTextAtSelection(text: string, options?: { remove?: 'word' | 'character' | RegExp }) {
    const { selectionEnd, selectionStart } = this.element
    if (selectionEnd === null || selectionStart === null) return

    const remove = options?.remove

    if (remove === undefined) {
      return document.execCommand('insertText', false, text)
    }

    if (remove === 'character') {
      this.element.setSelectionRange(Math.max(selectionStart - 1, 0), selectionEnd)
      document.execCommand('insertText', false, text)
      return
    }

    const selection = await this.getSelectionAfterInput()

    if (!selection) return

    if (remove === 'word') {
      this.element.setSelectionRange(selection.caret.start, selection.caret.end)
      document.execCommand('insertText', false, text)
      return
    }

    this.element.setSelectionRange(selection.textBeforeSelection.replace(remove, '').length, selection.caret.end)
    document.execCommand('insertText', false, text)
  }

  private isConvertableKeys(ev: KeyboardEvent) {
    const isShiftSpace = ev.key === ' ' && ev.shiftKey
    return /^([a-zA-Zа-яА-Я]|ө|ү|Ө|Ү|ё|Ё)$/.test(ev.key) || isShiftSpace
  }

  private isSpecialKeys(event: KeyboardEvent) {
    return (event.ctrlKey && !event.metaKey) || (!event.ctrlKey && event.metaKey)
  }

  private async removeCharacterBeforeSelection() {
    await this.insertTextAtSelection('', { remove: 'character' })

    const selection = await this.getSelectionAfterInput()

    if (selection?.selectedWord.substr(-2) === KEY.connector) {
      await this.insertTextAtSelection('', { remove: /᠎᠊$/ })
    } else if (
      ([KEY.empty, KEY.connectorWithNoEmptySpace, '\n'] as string[]).includes(
        selection?.selectedWord.substr(-1) ?? 'none',
      )
    ) {
      await this.insertTextAtSelection('', { remove: 'character' })
    }
  }

  private resetState() {
    this.state = this.getDefaultState()
  }

  private async updateState() {
    const selection = await this.getSelectionAfterInput()

    if (!selection) {
      return this.resetState()
    }

    this.state = {
      ...selection,
      selectedWordBeforeConversion: selection.selectedWord,
      conversionId: 0,
    }
  }
}
