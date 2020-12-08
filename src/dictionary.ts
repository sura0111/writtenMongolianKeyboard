import { DICTIONARY, WRITTEN_MONGOL_TYPE, WRITTEN_TO_LATIN, KEY as _k } from '@/database'
import { DictionaryList } from '@/definitions'

export class Dictionary {
  public static maxConversions = 10

  public static getConversions(text: string, precedingWord?: string): DictionaryList {
    if (!text) {
      return []
    }

    const conversions = [
      ...Dictionary.getConversionsFromTraditional('traditional', text),
      ...Dictionary.getConversionsFromTraditional('cyrillic', text),
      ...Dictionary.getConversionsFromTraditional('latin', text),
    ]
      .filter(
        (a, i, arr) =>
          a.traditional &&
          !arr
            .slice(0, i)
            .map((b) => b.traditional)
            .includes(a.traditional),
      )
      .sort((a, b) => a.traditional.length - b.traditional.length)

    if (!conversions.find((item) => item.traditional === text)) {
      conversions.splice(1, 0, { traditional: text, cyrillic: '', latin: '' })
    }

    const precedingChar = precedingWord?.slice(-1)
    const erVowels: string[] = [_k.a, _k.o, _k.ou]
    const isErUg = text.split('').some((c) => erVowels.includes(c))
    if (
      WRITTEN_MONGOL_TYPE.vovels.includes(precedingChar) &&
      ['᠊ᠣᠨ', '᠊ᠤᠨ', 'ᠤᠨ', '᠊ᠣ', '᠊ᠤ', 'ᠢᠢᠨ', 'ᠣ', 'ᠢᠢ'].includes(text)
    ) {
      conversions.splice(0, 0, { traditional: '᠊ᠢᠢᠨ', cyrillic: '-ийн, -ын, -н', latin: '-iin, -n' })
    } else if (
      WRITTEN_MONGOL_TYPE.consonantWithoutN.includes(precedingChar) &&
      ['᠊ᠢᠢᠨ', '᠊ᠣ', '᠊ᠤ', 'ᠢᠢᠨ', 'ᠣ', 'ᠢᠢ', 'ᠤᠨ'].includes(text)
    ) {
      conversions.splice(0, 0, { traditional: '᠊ᠤᠨ', cyrillic: '-ийн, -ын, -н', latin: '-iin, -n' })
    } else if (precedingChar === 'ᠨ' && ['᠊ᠢᠢᠨ', '᠊ᠣᠨ', '᠊ᠤᠨ', 'ᠤᠨ', 'ᠢᠢᠨ', 'ᠣ', 'ᠢᠢ'].includes(text)) {
      conversions.splice(0, 0, { traditional: '᠊ᠤ', cyrillic: '-ийн, -ын, -н', latin: '-iin, -n' })
    } else if (WRITTEN_MONGOL_TYPE.vovels.includes(precedingChar) && ['᠊ᠢᠢ', 'ᠭ', 'ᠢᠢᠭ'].includes(text)) {
      conversions.splice(0, 0, { traditional: '᠊ᠢ', cyrillic: '-ийг, -ыг, -г', latin: '-iig, -g' })
    } else if (WRITTEN_MONGOL_TYPE.consonants.includes(precedingChar) && ['᠊ᠢ', 'ᠭ', 'ᠢᠢᠭ'].includes(text)) {
      conversions.splice(0, 0, { traditional: '᠊ᠢᠢ', cyrillic: '-ийг, -ыг, -г', latin: '-iig, -g' })
    } else if (
      [
        `${_k.a}${_k.a}${_k.s}`,
        `${_k.e}${_k.e}${_k.s}`,
        `${_k.o}${_k.o}${_k.s}`,
        `${_k.u}${_k.u}${_k.s}`,
        isErUg ? `${_k.e}${_k.ch}${_k.e}` : `${_k.a}${_k.ch}${_k.a}`,
      ].includes(text) &&
      precedingChar
    ) {
      conversions.splice(0, 0, {
        traditional: isErUg ? 'ᠠᠴᠠ' : 'ᠡᠴᠡ',
        cyrillic: '-аас, -ээс, -оос -өөс, -с',
        latin: '-aas, -ees, -oos, -uus, -s',
      })
    } else if (
      [
        `${_k.o}${_k.o}${_k.r}`,
        `${_k.uo}${_k.uo}${_k.r}`,
        `${_k.a}${_k.a}${_k.r}`,
        `${_k.e}${_k.e}${_k.r}`,
        `${_k.b}${_k.a}${_k.r}`,
        `${_k.b}${_k.e}${_k.r}`,
        isErUg ? `${_k.connector}${_k.i}${_k.i}${_k.e}${_k.r}` : `${_k.connector}${_k.i}${_k.i}${_k.a}${_k.r}`,
      ].includes(text) &&
      WRITTEN_MONGOL_TYPE.consonants.includes(precedingChar)
    ) {
      if (isErUg) {
        conversions.splice(0, 0, {
          traditional: `${_k.connector}${_k.i}${_k.i}${_k.a}${_k.r}`,
          cyrillic: '-аар, -оор, -р',
          latin: '-aar, oor, -r',
        })
      } else {
        conversions.splice(0, 0, {
          traditional: `${_k.connector}${_k.i}${_k.i}${_k.e}${_k.r}`,
          cyrillic: '-ээр, -өөр, -р',
          latin: '-eer, uur, -r',
        })
      }
    } else if (
      ['ᠣᠣᠷ', 'ᠥᠥᠷ', 'ᠠᠠᠷ', 'ᠡᠡᠷ', '᠊ᠢᠢᠠᠷ'].includes(text) &&
      WRITTEN_MONGOL_TYPE.vovels.includes(precedingChar)
    ) {
      conversions.splice(0, 0, { traditional: 'ᠪᠠᠷ', cyrillic: '-аар, -ээр, -р', latin: '-aar, -eer, -r' })
    } else if (
      ['᠊ᠳᠣ', 'ᠳᠣ', 'ᠳᠣᠷ', 'ᠳ', '᠊ᠲᠣ', 'ᠲᠣ', 'ᠲᠣᠷ', '᠊ᠲᠣᠷ', 'ᠲ'].includes(text) &&
      WRITTEN_MONGOL_TYPE.consonantsSoft.includes(precedingChar)
    ) {
      conversions.splice(0, 0, { traditional: '᠊ᠳᠣᠷ', cyrillic: '-д, -нд', latin: '-d, -nd' })
    } else if (['᠊ᠳᠣ', 'ᠳᠣ', '᠊ᠳᠣᠷ', 'ᠳᠣᠷ', 'ᠳ', '᠊ᠲᠣ', 'ᠲᠣ', '᠊ᠲᠣᠷ', 'ᠲ'].includes(text)) {
      conversions.splice(0, 0, { traditional: 'ᠲᠣᠷ', cyrillic: '-д, -нд', latin: '-d, -nd' })
    }

    return conversions
  }

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

  private static getConversionsFromType(type: 'cyrillic' | 'traditional' | 'latin', text: string) {
    if (text.length > 0) {
      return DICTIONARY.filter((item) => item[type]?.indexOf(text) === 0 && item.traditional)
        .sort((a, b) => a.traditional.length - b.traditional.length)
        .slice(0, Dictionary.maxConversions)
    }
    return []
  }

  private static getConversionsFromTraditional(type: 'cyrillic' | 'traditional' | 'latin', text: string) {
    const chars = text.split('').map((char) => (WRITTEN_TO_LATIN[char] ?? [])[type] ?? [char])
    const conversion = Dictionary.generateConversionWords(chars)
    return ([] as DictionaryList).concat(
      ...conversion.map((word) => {
        return Dictionary.getConversionsFromType(type, word)
      }),
    )
  }
}
