/* eslint-disable @typescript-eslint/no-non-null-assertion */

import builtInConversionHtml from '@/builtInConversionHtml'
import builtInConversionStyle from '@/builtInConversionStyle'
import { KEY_MAP, KEY } from '@/database'
import { SwitchEvent, EditableState, DictionaryItem } from '@/definitions'
import { Dictionary } from '@/dictionary'
import ContentEditableCaret from '@/ContentEditableCaret'
import { WRITTEN_MONGOL_TYPE } from './database/index'

export default class WrittenMongolKeyboardEditable {
  private static EVENT_TYPE: 'keydown' = 'keydown'

  private _elementId: string | null = null
  private _state: EditableState | null = null
  private _switch = true
  private builtIn: {
    view: HTMLDivElement
    style: HTMLStyleElement
  } | null = null
  private caret: ContentEditableCaret
  private main = (event: KeyboardEvent) => {
    const isSpecialKeys = this.isSpecialKeys(event)

    if (isSpecialKeys) {
      if (['m', 'т'].includes(event.key)) {
        event.preventDefault()
        this.state = null
        this.switch = !this.switch
        return
      }
    }

    if (this.switch === false || isSpecialKeys) {
      this.state = null
      return
    }

    // this.state.coordinate = this.coordinate
    if (this.isConvertableKeys(event)) {
      this.convert(event)
      return
    }

    switch (event.key) {
      case 'Backspace':
        this.removeCharacterBeforeCaret(event)
        return
      case ' ':
      case 'ArrowRight':
        this.changeConversion(event, 1)
        return
      case 'ArrowLeft':
        this.changeConversion(event, -1)
        return
      case 'Enter':
        this.confirmConversion(event)
        return
      default:
        return
    }
  }

  private onChangeListener: (event: EditableState | null) => void
  private onSwitchListener: SwitchEvent

  public constructor(id: string, options?: { hasBuiltInConversionView: boolean; maxConversions: number }) {
    this.onChangeListener = () => undefined
    this.onSwitchListener = () => undefined
    this.elementId = id
    this.hasBuiltInConversionView = options?.hasBuiltInConversionView
    Dictionary.maxConversions = options?.maxConversions ?? 8
    this.caret = new ContentEditableCaret(id)
  }

  public get switch(): boolean {
    return this._switch
  }

  public set switch(value: boolean) {
    this._switch = value
    this.state = null
    this.onSwitchListener(value)
  }

  private get element() {
    return document.querySelector(this.elementId) as HTMLElement
  }

  private get elementId(): string {
    return this._elementId!
  }

  private set elementId(value: string) {
    if (this._elementId) {
      ;(document.querySelector(this._elementId) as HTMLElement)?.removeEventListener(
        WrittenMongolKeyboardEditable.EVENT_TYPE,
        this.main,
      )
    }
    this._elementId = value
    this.element.addEventListener(WrittenMongolKeyboardEditable.EVENT_TYPE, this.main)
  }

  // private get hasBuildInConversionView() {
  //   return !!document.querySelector('#writtenMongolKeyboard')
  // }
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

  private get state() {
    return this._state
      ? {
          ...this._state,
          selectedWord: this._state.conversions[this._state.conversionId],
        }
      : null
  }

  private set state(value: (EditableState & { selectedWord?: DictionaryItem }) | null) {
    this._state =
      value && value.conversions.length > 0
        ? {
            savedSelection: value.savedSelection,
            coordinate: value.coordinate,
            conversionId:
              value.conversions.length <= value.conversionId
                ? 0
                : value.conversionId < 0
                ? value.conversions.length - 1
                : value.conversionId,
            conversions: value.conversions,
          }
        : null
    if (this.builtIn) {
      if (this._state) {
        this.builtIn.view.innerHTML = builtInConversionHtml(this._state)
        const childNode = this.builtIn.view.firstElementChild as HTMLDivElement | null
        const { offsetHeight, offsetWidth } = childNode ?? { offsetHeight: 0, offsetWidth: 0 }
        const left =
          this._state.coordinate.left + offsetWidth <= document.body.offsetWidth
            ? this._state.coordinate.left
            : document.body.offsetWidth - offsetWidth
        const top =
          this._state.coordinate.top + offsetHeight <= document.body.offsetHeight
            ? this._state.coordinate.top
            : document.body.offsetHeight - offsetHeight
        this._state = { ...this._state, coordinate: { left, top } }
        this.builtIn.view.innerHTML = builtInConversionHtml(this._state)
        document.querySelectorAll('.writtenMongolKeyboardConversions_item').forEach((div) => {
          const selection = (id: number) => this.selectConversion(id)
          ;(div as HTMLDivElement).addEventListener('click', function () {
            const id = Number(this.getAttribute('data-id'))
            selection(id)
          })
        })
      } else {
        this.builtIn.view.innerHTML = ''
      }
    }
    this.onChangeListener(this._state)
  }

  public onChange(callback: (event: EditableState | null) => void): void {
    this.onChangeListener = callback
  }

  public onSwitch(callback: SwitchEvent): void {
    this.onSwitchListener = callback
  }

  public selectConversion(conversionId: number): void {
    if (this.state) {
      this.element.focus()
      this.caret.restoreSelection(this.state?.savedSelection)
      this.caret.insertText(this.state.conversions[conversionId].traditional, { remove: 'word' })
      this.state = null
    }
  }

  private async changeConversion(event: KeyboardEvent, add: 1 | -1 = 1) {
    if (this.state && this.state.conversions.length > 0) {
      event.preventDefault()
      this.state = {
        ...this.state,
        conversionId: this.state.conversionId + add,
      }

      const selectedWord = this.state.selectedWord!
      this.caret.insertText(selectedWord.traditional, { remove: 'word' })
      this.updateState(false)
    }
  }

  private confirmConversion(event: KeyboardEvent) {
    if (this.state?.selectedWord?.traditional) {
      event.preventDefault()
      this.caret.insertText(this.state.selectedWord.traditional, { remove: 'word' })
    }

    this.state = null
    return
  }

  private async convert(event: KeyboardEvent) {
    event.preventDefault()

    const keyword = event.key.toLowerCase()
    await this.nextTick()
    const previousCharacters = this.caret.getCaretCharacter('backward', 2).padStart(2, ' ').split('')

    if (!WRITTEN_MONGOL_TYPE.vovels.includes(previousCharacters[0])) {
      if (previousCharacters[1] === KEY.l && ['h', 'х'].includes(keyword)) {
        this.caret.insertText(KEY.lh, { remove: 1 })
        return
      } else if (previousCharacters[1] === KEY.ch && keyword === 'h') {
        this.caret.insertText(KEY.ch, { remove: 1 })
        return
      } else if (previousCharacters[1] === KEY.t && keyword === 's') {
        this.caret.insertText(KEY.ch, { remove: 1 })
        return
      }
    }

    const lowerCaseKey = event.key.toLowerCase()
    const keyCode = `${event.shiftKey ? 'shift' : ''}${lowerCaseKey}`
    const convertedChar = KEY_MAP[keyCode] ?? KEY_MAP[lowerCaseKey] ?? event.key
    this.caret.insertText(convertedChar)
    this.updateState()
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

  private async removeCharacterBeforeCaret(event: KeyboardEvent) {
    event.preventDefault()
    this.caret.insertText('', { remove: 1 })
    await this.nextTick()
    const previousCharacters = this.caret.getCaretCharacter('backward', 2)
    if (previousCharacters === KEY.connector) {
      this.caret.insertText('', { remove: 2 })
    } else if (
      ([KEY.empty, KEY.connectorWithNoEmptySpace, '\n'] as string[]).includes(previousCharacters.substr(-1) ?? 'none')
    ) {
      this.caret.insertText('', { remove: 1 })
    }
    this.updateState()
  }

  private async updateState(updateConversions = true) {
    await this.nextTick()
    const savedSelection = this.caret.saveSelection()
    const coordinate = this.caret.getCoordinate()
    if (updateConversions) {
      const caretWord = this.caret.getCaretWord()
      const precedingWord = this.caret.getWordBeforeCaretWord()

      if (!caretWord) {
        this.state = null
        return
      }

      const conversions = Dictionary.getConversions(caretWord, precedingWord)

      this.state = {
        ...this.state,
        savedSelection,
        coordinate,
        conversions,
        conversionId: 0,
      }
    } else if (this.state) {
      this.state = {
        ...this.state,
        savedSelection,
        coordinate,
      }
    }
  }
}
