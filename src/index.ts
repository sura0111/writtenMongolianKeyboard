/* eslint-disable @typescript-eslint/no-non-null-assertion */
import textareaCaret from 'textarea-caret'

import builtInConversionHtml from '@/builtInConversionHtml'
import builtInConversionStyle from '@/builtInConversionStyle'
import { KEY_MAP, KEY, WRITTEN_MONGOL_TYPE } from '@/database'
import { KeyChangeEvent, KeyChangeState, SwitchEvent } from '@/definitions'
import { Dictionary } from '@/dictionary'

export { default as WrittenMongolForContentEditable } from './editable'

export default class WrittenMongolKeyboard {
  private static ACCEPTED_TAG_NAMES: (string | null | undefined)[] = ['TEXTAREA', 'INPUT']
  private static EVENT_TYPE: 'keydown' = 'keydown'

  private _state: KeyChangeState
  private _switch = true
  private builtIn: {
    view: HTMLDivElement
    style: HTMLStyleElement
  } | null = null
  private hasPredefinedElement: boolean
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

    if (this.isSpecialKeys(event)) {
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
    this._state = this.getDefaultState()
    this.onChangeListener = () => undefined
    this.onSwitchListener = () => undefined
    this.predefinedElement = target
    this.hasPredefinedElement = target !== undefined
    this.mainElement.addEventListener(WrittenMongolKeyboard.EVENT_TYPE, this.main)
    this.hasBuiltInConversionView = options?.hasBuiltInConversionView
    Dictionary.maxConversions = options?.maxConversions ?? 8
  }

  private set hasBuiltInConversionView(value: boolean | undefined) {
    if ((value === true || value === undefined) && !this.builtIn) {
      const view = document.createElement('div')
      view.id = 'writtenMongolKeyboard'
      document.body.appendChild(view)

      const style = document.createElement('style')
      style.innerHTML = builtInConversionStyle
      style.id = 'writtenMongolKeyboardStyle'
      document.head.appendChild(style)
      this.builtIn = { view, style }
    } else {
      this.builtIn?.view.remove()
      this.builtIn?.style.remove()
      this.builtIn = null
    }
  }

  public get switch(): boolean {
    return this._switch
  }

  public set switch(value: boolean) {
    this._switch = value
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
    return this._state
  }

  private set state(value) {
    this.onChangeListener(value)
    if (this.builtIn?.view) {
      this.builtIn.view.innerHTML = builtInConversionHtml(value)
      document.querySelectorAll('.writtenMongolKeyboardConversions_item').forEach((div) => {
        const selection = (id: number) => this.selectConversion(id)
        ;(div as HTMLDivElement).addEventListener('click', function () {
          const id = Number(this.getAttribute('data-id'))
          selection(id)
        })
      })
    }
    this._state = value
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
    this._state.conversionId = conversionId
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
      const selection = await this.getCaretInfoAsync()

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
    const selection = this.getCaretInfo()

    // convert 'lh' or 'лх' to 'ᡀ' if the word is started with it
    if (selection) {
      const previousCharacters = selection.textBeforeSelection.substr(-2).padStart(2, ' ').split('')
      if (!WRITTEN_MONGOL_TYPE.vovels.includes(previousCharacters[0])) {
        if (previousCharacters[1] === KEY.l && ['h', 'х'].includes(keyword)) {
          this.insertTextAtSelection(KEY.lh, { remove: 'character' })
          return
        } else if (previousCharacters[1] === KEY.ch && keyword === 'h') {
          this.insertTextAtSelection(KEY.ch, { remove: 'character' })
          return
        } else if (previousCharacters[1] === KEY.t && keyword === 's') {
          this.insertTextAtSelection(KEY.ch, { remove: 'character' })
          return
        } else if (previousCharacters[1] === KEY.s && keyword === 'h') {
          this.insertTextAtSelection(KEY.sh, { remove: 'character' })
          return
        }
      }
    }

    this.insertTextAtSelection(this.getConvertedKey(event))
  }

  private getCaretInfo() {
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

  private async getCaretInfoAsync() {
    await this.nextTick()
    return this.getCaretInfo()
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

    const selection = await this.getCaretInfoAsync()

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
    return /^[a-zA-Z\u1800-\u18AF\u0400-\u04FF]$/.test(ev.key) || isShiftSpace
  }

  private isSpecialKeys(event: KeyboardEvent) {
    return (event.ctrlKey && !event.metaKey) || (!event.ctrlKey && event.metaKey)
  }

  private nextTick(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve))
  }

  private async removeCharacterBeforeSelection() {
    await this.insertTextAtSelection('', { remove: 'character' })

    const selection = await this.getCaretInfoAsync()

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
    const selection = await this.getCaretInfoAsync()

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
