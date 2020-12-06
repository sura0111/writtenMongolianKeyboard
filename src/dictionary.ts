import { WRITTEN_TO_ALPHABET, WRITTEN_MONGOL_TYPE } from './constants'
import dictionary from './constants/dictionary.json'

const { dict } = dictionary as { dict: WrittenMongol.DictionaryList }

enum DictionaryMapper {
  alphabet = 'latin_direct',
  written = 'written',
  cyrillic = 'cyrillic',
}

export class Dictionary {
  public static maxConversions = 10
  private static generateConversionWords(chars: string[][]) {
    let t: string[] = []
    for (const c1 of chars) {
      let t1: string[]
      if (t.length === 0) {
        t1 = c1
      } else {
        t1 = []
        for (const c2 of c1) {
          const t2 = t.slice().map((t) => `${t}${c2}`)
          t1 = [...t1, ...t2]
        }
      }
      t = t1.slice()
    }
    return t
  }

  private static cyrillic(text: string) {
    const chars = text.split('').map((char) => WRITTEN_TO_ALPHABET[char]?.cyrillic ?? [char])
    return Dictionary.generateConversionWords(chars)
  }

  private static alphabet(text: string) {
    const chars = text.split('').map((char) => WRITTEN_TO_ALPHABET[char]?.alphabet ?? [char])
    return Dictionary.generateConversionWords(chars)
  }

  private static getConversionsFromType(type: 'cyrillic' | 'written' | 'alphabet', text: string) {
    return dict
      .filter((item) => item[DictionaryMapper[type]]?.indexOf(text) === 0)
      .sort((a, b) => a.written.length - b.written.length)
      .slice(0, Dictionary.maxConversions)
  }

  private static getConversionsFromWritten(type: 'cyrillic' | 'written' | 'alphabet', text: string) {
    if (type === 'written') {
      return Dictionary.getConversionsFromType(type, text)
    }
    return ([] as WrittenMongol.DictionaryItem[]).concat(
      ...Dictionary[type](text).map((word) => {
        return Dictionary.getConversionsFromType(type, word)
      }),
    )
  }

  public static getConversions(text: string, precedingWord?: string): WrittenMongol.DictionaryList {
    if (!text) {
      return []
    }

    const conversions = [
      ...Dictionary.getConversionsFromWritten('written', text),
      ...Dictionary.getConversionsFromWritten('cyrillic', text),
      ...Dictionary.getConversionsFromWritten('alphabet', text),
    ]
      .filter(
        (a, i, arr) =>
          a.written &&
          !arr
            .slice(0, i)
            .map((b) => b.written)
            .includes(a.written),
      )
      .sort((a, b) => a.written.length - b.written.length)
    if (!conversions.find((item) => item.written === text)) {
      conversions.splice(0, 0, { written: text })
    }

    const precedingChar = precedingWord?.slice(-1)
    if (WRITTEN_MONGOL_TYPE.vovels.includes(precedingChar) && ['᠊ᠣᠨ', '᠊ᠣ', 'ᠢᠢᠨ', 'ᠣ', 'ᠢᠢ'].includes(text)) {
      conversions.splice(0, 0, { written: '᠊ᠢᠢᠨ' })
    } else if (
      WRITTEN_MONGOL_TYPE.consonantWithoutN.includes(precedingChar) &&
      ['᠊ᠢᠢᠨ', '᠊ᠣ', 'ᠢᠢᠨ', 'ᠣ', 'ᠢᠢ'].includes(text)
    ) {
      conversions.splice(0, 0, { written: '᠊ᠣᠨ' })
    } else if (precedingChar === 'ᠨ' && ['᠊ᠢᠢᠨ', '᠊ᠣᠨ', 'ᠢᠢᠨ', 'ᠣ', 'ᠢᠢ'].includes(text)) {
      conversions.splice(0, 0, { written: '᠊ᠣ' })
    } else if (WRITTEN_MONGOL_TYPE.vovels.includes(precedingChar) && ['᠊ᠢᠢ', 'ᠭ', 'ᠢᠢᠭ'].includes(text)) {
      conversions.splice(0, 0, { written: '᠊ᠢ' })
    } else if (WRITTEN_MONGOL_TYPE.consonants.includes(precedingChar) && ['᠊ᠢ', 'ᠭ', 'ᠢᠢᠭ'].includes(text)) {
      conversions.splice(0, 0, { written: '᠊ᠢᠢ' })
    } else if ((text === 'ᠠᠠᠰ' || text === 'ᠡᠡᠰ' || text === 'ᠣᠣᠰ') && precedingChar) {
      conversions.splice(0, 0, { written: 'ᠡᠴᠡ' })
    } else if (
      ['ᠣᠣᠷ', 'ᠥᠥᠷ', 'ᠠᠠᠷ', 'ᠡᠡᠷ', 'ᠪᠠᠷ'].includes(text) &&
      WRITTEN_MONGOL_TYPE.consonants.includes(precedingChar)
    ) {
      conversions.splice(0, 0, { written: '᠊ᠢᠢᠠᠷ' })
    } else if (
      ['᠊ᠳᠣ', 'ᠳᠣ', 'ᠳᠣᠷ', 'ᠳ', '᠊ᠲᠣ', 'ᠲᠣ', 'ᠲᠣᠷ', '᠊ᠲᠣᠷ', 'ᠲ'].includes(text) &&
      WRITTEN_MONGOL_TYPE.consonantsSoft.includes(precedingChar)
    ) {
      conversions.splice(0, 0, { written: '᠊ᠳᠣᠷ' })
    } else if (['᠊ᠳᠣ', 'ᠳᠣ', '᠊ᠳᠣᠷ', 'ᠳᠣᠷ', 'ᠳ', '᠊ᠲᠣ', 'ᠲᠣ', '᠊ᠲᠣᠷ', 'ᠲ'].includes(text)) {
      conversions.splice(0, 0, { written: 'ᠲᠣᠷ' })
    } else if (
      ['ᠣᠣᠷ', 'ᠥᠥᠷ', 'ᠠᠠᠷ', 'ᠡᠡᠷ', '᠊ᠢᠢᠠᠷ'].includes(text) &&
      WRITTEN_MONGOL_TYPE.vovels.includes(precedingChar)
    ) {
      conversions.splice(0, 0, { written: 'ᠪᠠᠷ' })
    }

    return conversions
  }
}
