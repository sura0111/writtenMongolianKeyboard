import textareaCaret from 'textarea-caret'

type Target = HTMLInputElement | HTMLTextAreaElement

export default class TextAreaSelection {
  element(target?: HTMLElement | EventTarget | null): Target | null {
    return ['TEXTAREA', 'INPUT'].includes((target as HTMLElement)?.tagName ?? '')
      ? (target as Target)
      : null
  }

  public coordinate(target: Target): { left: number; top: number } | null {
    const element = this.element(target)
    if (!element) {
      return null
    }
    const localCoordinate = textareaCaret(element, element.selectionEnd ?? 0)
    const frame = element.getBoundingClientRect()

    return {
      left: frame.left + localCoordinate.left,
      top: frame.top + localCoordinate.top,
    }
  }

  public async insertText(text: string, target?: Target, remove?: 'word' | 'character' | RegExp) {
    if (!remove) {
      return document.execCommand('insertText', false, text)
    }

    const element = this.element(target)

    if (!element || !element.selectionStart || !element.selectionEnd) {
      return
    }

    const { selectionEnd, selectionStart } = element

    if (remove === 'character') {
      element.setSelectionRange(Math.max(selectionStart - 1, 0), selectionEnd)
      this.insertText(text)
      return
    }

    const selection = await this.getSelection(element)
    if (selection) {
      if (remove === 'word') {
        element.setSelectionRange(selection.current.start, selection.current.end)
        this.insertText(text)
        return
      }

      const start = selection.preceding.text.replace(remove, '').length
      element.setSelectionRange(start, selection.current.end)
      this.insertText(text)
    }
  }

  private selection(element: HTMLInputElement | HTMLTextAreaElement) {
    const { selectionEnd, selectionStart, value } = element
    if (!selectionStart || selectionStart !== selectionEnd) {
      return null
    }

    const start = value
      .substr(0, selectionStart)
      .replace(/\n/, ' ')
      .split(' ')
      .slice(0, -1)
      .join(' ').length

    const endIndex = value
      .substr(selectionStart)
      .replace(/\n/, ' ')
      .split(' ')
      .slice(0, 1)[0].length
    const end = endIndex < 1 ? value.length : selectionStart + endIndex
    const precedingText = value.substring(0, start)
    const currentWord = value.substring(start, end)
    return {
      element,
      current: {
        word: currentWord.trim(),
        start: currentWord.indexOf(' ') === 0 ? start + 1 : start,
        end,
      },
      preceding: {
        word: precedingText.replace(/^.+\s/, ''),
        text: precedingText,
      },
    }
  }

  public getSelection(
    target: Target,
  ): Promise<{
    element: Target
    current: {
      word: string
      start: number
      end: number
    }
    preceding: {
      word: string
      text: string
    }
  } | null> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.selection(target)))
    })
  }
}
