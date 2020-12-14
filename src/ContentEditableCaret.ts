export default class ContentEditableCaret {
  private element: HTMLElement

  public constructor(id: string) {
    const element = document.querySelector(id) as HTMLElement | null
    if (!element) {
      throw new Error(`element with ${id} id does not exist`)
    }
    this.element = element
  }

  private getSelection(): surakh.Selection | null {
    return window.getSelection() as surakh.Selection | null
  }

  private getRange(): Range | null {
    const selection = this.getSelection()
    if (selection?.rangeCount) {
      return selection.getRangeAt(0)
    }
    return null
  }

  public saveSelection(): { start: number; end: number } | null {
    const range = this.getRange()
    if (range) {
      const preSelectionRange = range.cloneRange()
      preSelectionRange.selectNodeContents(this.element)
      preSelectionRange.setEnd(range.startContainer, range.startOffset)
      const start = preSelectionRange.toString().length

      return {
        start,
        end: start + range.toString().length,
      }
    }
    return null
  }

  public restoreSelection(savedSelection?: { start: number; end: number } | null): void {
    if (!savedSelection) {
      return
    }
    let charIndex = 0
    const range = document.createRange()
    range.setStart(this.element, 0)
    range.collapse(true)
    const nodeStack = [this.element]
    let node: HTMLElement | Text | undefined = undefined
    let foundStart = false
    let stop = false

    while (!stop && (node = nodeStack.pop())) {
      if (node.nodeType == 3) {
        const textNode = (node as unknown) as Text
        const nextCharIndex = charIndex + textNode.length
        if (!foundStart && savedSelection.start >= charIndex && savedSelection.start <= nextCharIndex) {
          range.setStart(textNode, savedSelection.start - charIndex)
          foundStart = true
        }
        if (foundStart && savedSelection.end >= charIndex && savedSelection.end <= nextCharIndex) {
          range.setEnd(textNode, savedSelection.end - charIndex)
          stop = true
        }
        charIndex = nextCharIndex
      } else {
        let i = node.childNodes.length
        while (i--) {
          nodeStack.push(node.childNodes[i] as HTMLElement)
        }
      }
    }

    this.setRange(range)
  }

  private setRange(range: Range) {
    const selection = this.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
  }

  public getCoordinate(): { left: number; top: number } {
    const selection = window.getSelection()
    let left = 0
    let top = 0
    if (selection?.rangeCount) {
      const range = selection.getRangeAt(0).cloneRange()
      if (range.getClientRects) {
        range.collapse(true)
        const rects = range.getClientRects()
        if (rects.length > 0) {
          left = rects[0].left
          top = rects[0].top
        }
      }

      if (left == 0 && top == 0) {
        const span = document.createElement('span')
        if (span.getClientRects) {
          span.appendChild(document.createTextNode('\u200b'))
          range.insertNode(span)
          const rect = span.getClientRects()[0]
          left = rect.left
          top = rect.top
          const spanParent = span.parentNode
          spanParent?.removeChild(span)
          spanParent?.normalize()
        }
      }
    }
    return {
      left,
      top,
    }
  }

  public getTextBeforeCaret(): string {
    const selection = this.getSelection()
    if (!selection?.isCollapsed) {
      return ''
    }

    const savedSelection = this.saveSelection()

    const range = this.getRange()
    if (!range) {
      return ''
    }
    range.setStart(this.element, 0)
    const text = range.toString()

    this.restoreSelection(savedSelection)
    return text
  }

  private getTextBeforeCaretWord(): string {
    return (
      this.getTextBeforeCaret()
        .replace(/([^\s\n]|\w|[\u1800-\u18AF]|[\u0400-\u04FF])+$/, '')
        .replace(/\s$/, '') ?? ''
    )
  }

  public getWordBeforeCaretWord(): string {
    return this.getTextBeforeCaretWord().replace(/^.+\s/g, '')
  }

  /** @param {'left' | 'right' | 'backward' | 'forward'} [left=left] */
  /** @param {number} [length=1] */
  private getCaretCharactersSelection(
    direction: 'left' | 'right' | 'backward' | 'forward' = 'left',
    length = 1,
  ): surakh.Selection | null {
    const selection = this.getSelection()
    if (!selection?.isCollapsed) {
      return null
    }
    for (let i = 0; i < length; i++) {
      selection.modify('extend', direction, 'character')
    }
    return selection
  }

  /** @param {'left' | 'right' | 'backward' | 'forward'} [left=left] */
  /** @param {number} [length=1] */
  public getCaretCharacter(direction: 'left' | 'right' | 'backward' | 'forward' = 'left', length = 1): string {
    const selection = this.getSelection()
    if (!selection?.isCollapsed) {
      return ''
    }
    const savedSelection = this.saveSelection()
    const char = this.getCaretCharactersSelection(direction, length)?.toString() ?? ''
    this.restoreSelection(savedSelection)
    return char
  }

  private getCaretWordSelection(): surakh.Selection | null {
    const selection = this.getSelection()
    if (!selection?.isCollapsed) {
      return null
    }
    const previousCharacter = this.getCaretCharacter('left')
    const edits: ('word' | 'character')[] = []
    if (/^[\w\u1800-\u18AF\u0400-\u04FF]$/.test(previousCharacter)) {
      selection.modify('move', 'left', 'word')
      edits.push('word')
      const prePreCharacter = this.getCaretCharacter('left', 3).trimStart()
      for (let i = 0; i < prePreCharacter.length; i++) {
        if (/^\u180e$/.test(prePreCharacter[i])) {
          selection.modify('move', 'left', 'character')
          selection.modify('move', 'left', 'word')
          selection.modify('move', 'right', 'character')
          edits.push('character', 'word')
        } else if (/^\u180a$/.test(prePreCharacter[i])) {
          selection.modify('move', 'left', 'character')
          edits.push('character')
        }
      }
    }
    edits.reverse().forEach((command) => {
      selection.modify('extend', 'right', command)
    })
    return selection
  }

  public getCharactersBeforeCaret(): string {
    const selection = this.getSelection()
    if (!selection?.isCollapsed) {
      return ''
    }
    const savedSelection = this.saveSelection()
    let word = ''
    const previousCharacter = this.getCaretCharacter('left')
    if (/^[\w\u1800-\u18AF\u0400-\u04FF]$/.test(previousCharacter)) {
      selection.modify('extend', 'left', 'word')
      word = selection.toString()
    }
    this.restoreSelection(savedSelection)
    return word
  }

  public getCaretWord(): string {
    const selection = this.getSelection()
    if (!selection?.isCollapsed) {
      return ''
    }
    const savedSelection = this.saveSelection()
    const word = this.getCaretWordSelection()?.toString() ?? ''
    this.restoreSelection(savedSelection)
    return word
  }

  public insertText(text: string, options?: { remove?: 'word' | 'character' | false | number }): void {
    if (options?.remove === 'word') {
      const selection = this.getCaretWordSelection()
      if (selection) {
        document.execCommand('insertText', false, text)
      }
      return
    }
    if (options?.remove || options?.remove === 'character') {
      const removeCharCount = options?.remove === 'character' ? 1 : Number(options?.remove)
      const selection = this.getCaretCharactersSelection('left', removeCharCount)
      if (selection) {
        document.execCommand('insertText', false, text)
      }
      return
    }
    document.execCommand('insertText', false, text)
  }
}
