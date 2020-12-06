import { WRITTEN_TO_ALPHABET, MON_WRITTEN } from '@/constants'
import dictionary from '@/constants/dictionary.json'

const { dict } = dictionary

enum DictionaryMapper {
  alphabet = 'latin_direct',
  written = 'written',
  cyrillic = 'cyrillic',
}

export class Dictionary {
  private static maxCandidatesPerType = 10
  private static generateCandidateWords(chars: string[][]) {
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
    return Dictionary.generateCandidateWords(chars)
  }

  private static alphabet(text: string) {
    const chars = text.split('').map((char) => WRITTEN_TO_ALPHABET[char]?.alphabet ?? [char])
    return Dictionary.generateCandidateWords(chars)
  }

  private static getCandidatesFromType(type: 'cyrillic' | 'written' | 'alphabet', text: string) {
    return dict
      .filter((item) => item[DictionaryMapper[type]]?.indexOf(text) === 0)
      .sort((a, b) => a.written.length - b.written.length)
      .slice(0, Dictionary.maxCandidatesPerType)
  }

  private static getCandidatesFromWritten(type: 'cyrillic' | 'written' | 'alphabet', text: string) {
    if (type === 'written') {
      return Dictionary.getCandidatesFromType(type, text)
    }
    return ([] as MonWritten.DictionaryItem[]).concat(
      ...Dictionary[type](text).map((word) => {
        return Dictionary.getCandidatesFromType(type, word)
      }),
    )
  }

  public static getCandidates(text: string, precedingWord?: string): MonWritten.DictionaryList {
    if (!text) {
      return []
    }

    const candidates = [
      ...Dictionary.getCandidatesFromWritten('written', text),
      ...Dictionary.getCandidatesFromWritten('cyrillic', text),
      ...Dictionary.getCandidatesFromWritten('alphabet', text),
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
    if (!candidates.find((item) => item.written === text)) {
      candidates.splice(0, 0, { written: text })
    }

    const precedingChar = precedingWord?.slice(-1)
    if (MON_WRITTEN.vovels.includes(precedingChar) && ['᠊ᠣᠨ', '᠊ᠣ', 'ᠢᠢᠨ', 'ᠣ', 'ᠢᠢ'].includes(text)) {
      candidates.splice(0, 0, { written: '᠊ᠢᠢᠨ' })
    } else if (
      MON_WRITTEN.consonantWithoutN.includes(precedingChar) &&
      ['᠊ᠢᠢᠨ', '᠊ᠣ', 'ᠢᠢᠨ', 'ᠣ', 'ᠢᠢ'].includes(text)
    ) {
      candidates.splice(0, 0, { written: '᠊ᠣᠨ' })
    } else if (precedingChar === 'ᠨ' && ['᠊ᠢᠢᠨ', '᠊ᠣᠨ', 'ᠢᠢᠨ', 'ᠣ', 'ᠢᠢ'].includes(text)) {
      candidates.splice(0, 0, { written: '᠊ᠣ' })
    } else if (MON_WRITTEN.vovels.includes(precedingChar) && ['᠊ᠢᠢ', 'ᠭ', 'ᠢᠢᠭ'].includes(text)) {
      candidates.splice(0, 0, { written: '᠊ᠢ' })
    } else if (MON_WRITTEN.consonants.includes(precedingChar) && ['᠊ᠢ', 'ᠭ', 'ᠢᠢᠭ'].includes(text)) {
      candidates.splice(0, 0, { written: '᠊ᠢᠢ' })
    } else if ((text === 'ᠠᠠᠰ' || text === 'ᠡᠡᠰ' || text === 'ᠣᠣᠰ') && precedingChar) {
      candidates.splice(0, 0, { written: 'ᠡᠴᠡ' })
    } else if (['ᠣᠣᠷ', 'ᠥᠥᠷ', 'ᠠᠠᠷ', 'ᠡᠡᠷ', 'ᠪᠠᠷ'].includes(text) && MON_WRITTEN.consonants.includes(precedingChar)) {
      candidates.splice(0, 0, { written: '᠊ᠢᠢᠠᠷ' })
    } else if (
      ['᠊ᠳᠣ', 'ᠳᠣ', 'ᠳᠣᠷ', 'ᠳ', '᠊ᠲᠣ', 'ᠲᠣ', 'ᠲᠣᠷ', '᠊ᠲᠣᠷ', 'ᠲ'].includes(text) &&
      MON_WRITTEN.consonantsSoft.includes(precedingChar)
    ) {
      candidates.splice(0, 0, { written: '᠊ᠳᠣᠷ' })
    } else if (['᠊ᠳᠣ', 'ᠳᠣ', '᠊ᠳᠣᠷ', 'ᠳᠣᠷ', 'ᠳ', '᠊ᠲᠣ', 'ᠲᠣ', '᠊ᠲᠣᠷ', 'ᠲ'].includes(text)) {
      candidates.splice(0, 0, { written: 'ᠲᠣᠷ' })
    } else if (['ᠣᠣᠷ', 'ᠥᠥᠷ', 'ᠠᠠᠷ', 'ᠡᠡᠷ', '᠊ᠢᠢᠠᠷ'].includes(text) && MON_WRITTEN.vovels.includes(precedingChar)) {
      candidates.splice(0, 0, { written: 'ᠪᠠᠷ' })
    }

    return candidates
  }
}
