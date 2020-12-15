import { DICTIONARY, WRITTEN_MONGOL_TYPE, WRITTEN_TO_LATIN, KEY as _k } from '@/database'
import { DictionaryList } from '@/definitions'

export class Dictionary {
  public static maxConversions = 10

  public static getConversions(text: string, precedingWord?: string): DictionaryList {
    if (!text.trim()) {
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
    const isConsonant = WRITTEN_MONGOL_TYPE.consonants.includes(precedingChar)
    const isConsonantWithoutN = WRITTEN_MONGOL_TYPE.consonantWithoutN.includes(precedingChar)
    const isSoftConsonant = WRITTEN_MONGOL_TYPE.consonantsSoft.includes(precedingChar)
    const isVovel = WRITTEN_MONGOL_TYPE.vovels.includes(precedingChar)

    const isPossiblyHaryalah = [
      `${_k.connectorWithNoEmptySpace}${_k.i}${_k.i}${_k.n}`,
      `${_k.connectorWithNoEmptySpace}${_k.o}`,
      `${_k.connectorWithNoEmptySpace}${_k.o}${_k.n}`,
      `${_k.connectorWithNoEmptySpace}${_k.ou}`,
      `${_k.connectorWithNoEmptySpace}${_k.ou}${_k.n}`,
      `${_k.connectorWithNoEmptySpace}${_k.u}`,
      `${_k.connectorWithNoEmptySpace}${_k.u}${_k.n}`,
      `${_k.connectorWithNoEmptySpace}${_k.uo}`,
      `${_k.connectorWithNoEmptySpace}${_k.uo}${_k.n}`,
      `${_k.i}${_k.i}`,
      `${_k.i}${_k.i}${_k.n}`,
      `${_k.o}${_k.n}`,
      `${_k.ou}`,
      `${_k.ou}${_k.n}`,
      `${_k.n}${_k.i}${_k.i}`,
    ].includes(text)

    const isPossiblyZaah = [
      `${_k.connectorWithNoEmptySpace}${_k.i}${_k.i}`,
      `${_k.g}`,
      `${_k.i}${_k.i}${_k.g}`,
    ].includes(text)

    const isPossiblyGarah = [
      `${_k.a}${_k.a}${_k.s}`,
      `${_k.e}${_k.e}${_k.s}`,
      `${_k.o}${_k.o}${_k.s}`,
      `${_k.u}${_k.u}${_k.s}`,
      `${_k.e}${_k.ch}${_k.e}`,
      `${_k.a}${_k.ch}${_k.a}`,
    ].includes(text)

    const isPossiblyUildeh = [
      `${_k.o}${_k.o}${_k.r}`,
      `${_k.uo}${_k.uo}${_k.r}`,
      `${_k.a}${_k.a}${_k.r}`,
      `${_k.e}${_k.e}${_k.r}`,
      `${_k.b}${_k.a}${_k.r}`,
      `${_k.b}${_k.e}${_k.r}`,
      `${_k.connectorWithNoEmptySpace}${_k.i}${_k.i}${_k.e}${_k.r}`,
      `${_k.connectorWithNoEmptySpace}${_k.i}${_k.i}${_k.a}${_k.r}`,
    ].includes(text)

    const isPossiblyUguhOrshih = [
      `${_k.t}`,
      `${_k.d}`,
      `${_k.connectorWithNoEmptySpace}${_k.t}`,
      `${_k.connectorWithNoEmptySpace}${_k.d}`,

      `${_k.t}${_k.o}${_k.r}`,
      `${_k.d}${_k.o}${_k.r}`,
      `${_k.t}${_k.o}`,
      `${_k.d}${_k.o}`,
      `${_k.connectorWithNoEmptySpace}${_k.t}${_k.o}${_k.r}`,
      `${_k.connectorWithNoEmptySpace}${_k.d}${_k.o}${_k.r}`,
      `${_k.connectorWithNoEmptySpace}${_k.t}${_k.o}`,
      `${_k.connectorWithNoEmptySpace}${_k.d}${_k.o}`,

      `${_k.t}${_k.ou}${_k.r}`,
      `${_k.d}${_k.ou}${_k.r}`,
      `${_k.t}${_k.ou}`,
      `${_k.d}${_k.ou}`,
      `${_k.connectorWithNoEmptySpace}${_k.t}${_k.ou}${_k.r}`,
      `${_k.connectorWithNoEmptySpace}${_k.d}${_k.ou}${_k.r}`,
      `${_k.connectorWithNoEmptySpace}${_k.t}${_k.ou}`,
      `${_k.connectorWithNoEmptySpace}${_k.d}${_k.ou}`,

      `${_k.t}${_k.u}${_k.r}`,
      `${_k.d}${_k.u}${_k.r}`,
      `${_k.t}${_k.u}`,
      `${_k.d}${_k.u}`,
      `${_k.connectorWithNoEmptySpace}${_k.t}${_k.u}${_k.r}`,
      `${_k.connectorWithNoEmptySpace}${_k.d}${_k.u}${_k.r}`,
      `${_k.connectorWithNoEmptySpace}${_k.t}${_k.u}`,
      `${_k.connectorWithNoEmptySpace}${_k.d}${_k.u}`,

      `${_k.t}${_k.uo}${_k.r}`,
      `${_k.d}${_k.uo}${_k.r}`,
      `${_k.t}${_k.uo}`,
      `${_k.d}${_k.uo}`,
      `${_k.connectorWithNoEmptySpace}${_k.t}${_k.uo}${_k.r}`,
      `${_k.connectorWithNoEmptySpace}${_k.d}${_k.uo}${_k.r}`,
      `${_k.connectorWithNoEmptySpace}${_k.t}${_k.uo}`,
      `${_k.connectorWithNoEmptySpace}${_k.d}${_k.uo}`,
    ].includes(text)

    const isPossiblyHamaatuulah = [
      `${_k.o}${_k.o}`,
      `${_k.uo}${_k.uo}`,
      `${_k.a}${_k.a}`,
      `${_k.e}${_k.e}`,
      `${_k.o}${_k.o}`,
      `${_k.uo}${_k.uo}${_k.n}`,
      `${_k.a}${_k.a}${_k.n}`,
      `${_k.e}${_k.e}${_k.n}`,
      `${_k.b}${_k.a}${_k.n}`,
      `${_k.b}${_k.e}${_k.n}`,
      `${_k.connectorWithNoEmptySpace}${_k.i}${_k.i}${_k.e}${_k.n}`,
      `${_k.connectorWithNoEmptySpace}${_k.i}${_k.i}${_k.a}${_k.n}`,
    ].includes(text)

    const isPossiblyChigleh = [
      `${_k.o}${_k.o}`,
      `${_k.uo}${_k.uo}`,
      `${_k.a}${_k.a}`,
      `${_k.e}${_k.e}`,
      `${_k.o}${_k.o}`,
      `${_k.uo}${_k.uo}${_k.n}`,
      `${_k.a}${_k.a}${_k.n}`,
      `${_k.e}${_k.e}${_k.n}`,
      `${_k.b}${_k.a}${_k.n}`,
      `${_k.b}${_k.e}${_k.n}`,
      `${_k.connectorWithNoEmptySpace}${_k.i}${_k.i}${_k.e}${_k.n}`,
      `${_k.connectorWithNoEmptySpace}${_k.i}${_k.i}${_k.a}${_k.n}`,
    ].includes(text)

    if (isVovel && isPossiblyHaryalah) {
      conversions.splice(0, 0, {
        traditional: `${_k.connectorWithNoEmptySpace}${_k.i}${_k.i}${_k.n}`,
        cyrillic: '-ийн, -ын, -н',
        latin: '-iin, -n',
      })
    } else if (isConsonantWithoutN && isPossiblyHaryalah) {
      conversions.splice(0, 0, {
        traditional: `${_k.connectorWithNoEmptySpace}${_k.ou}${_k.n}`,
        cyrillic: '-ийн, -ын, -н',
        latin: '-iin, -n',
      })
    } else if (precedingChar === _k.n && isPossiblyHaryalah) {
      conversions.splice(0, 0, {
        traditional: `${_k.connectorWithNoEmptySpace}${_k.ou}`,
        cyrillic: '-ийн, -ын, -н',
        latin: '-iin, -n',
      })
    } else if (isVovel && isPossiblyZaah) {
      conversions.splice(0, 0, {
        traditional: `${_k.connectorWithNoEmptySpace}${_k.i}`,
        cyrillic: '-ийг, -ыг, -г',
        latin: '-iig, -g',
      })
    } else if (isConsonant && isPossiblyZaah) {
      conversions.splice(0, 0, {
        traditional: `${_k.connectorWithNoEmptySpace}${_k.i}${_k.i}`,
        cyrillic: '-ийг, -ыг, -г',
        latin: '-iig, -g',
      })
    } else if (precedingChar && isPossiblyGarah) {
      conversions.splice(0, 0, {
        traditional: isErUg
          ? `${_k.connectorWithNoEmptySpace}${_k.a}${_k.ch}${_k.a}`
          : `${_k.connectorWithNoEmptySpace}${_k.e}${_k.ch}${_k.e}`,
        cyrillic: '-аас, -ээс, -оос -өөс, -с',
        latin: '-aas, -ees, -oos, -uus, -s',
      })
    } else if (isConsonant && isPossiblyUildeh) {
      conversions.splice(0, 0, {
        traditional: `${_k.connector}${_k.i}${_k.i}${isErUg ? _k.a : _k.e}${_k.r}`,
        cyrillic: '-аар, -оор, -р',
        latin: '-aar, oor, -r',
      })
    } else if (isVovel && isPossiblyUildeh) {
      conversions.splice(0, 0, {
        traditional: `${_k.b}${isErUg ? _k.a : _k.e}${_k.r}`,
        cyrillic: '-аар, -ээр, -р',
        latin: '-aar, -eer, -r',
      })
    } else if ((isVovel || isSoftConsonant) && isPossiblyUguhOrshih) {
      conversions.splice(0, 0, {
        traditional: `${_k.connectorWithNoEmptySpace}${_k.d}${_k.o}${_k.r}`,
        cyrillic: '-д, -нд',
        latin: '-d, -nd',
      })
      conversions.splice(0, 0, {
        traditional: `${_k.connectorWithNoEmptySpace}${_k.d}${isErUg ? _k.ou : _k.u}`,
        cyrillic: '-д, -нд',
        latin: '-d, -nd',
      })
    } else if (precedingChar && isPossiblyUguhOrshih) {
      conversions.splice(0, 0, { traditional: `${_k.t}${_k.ou}${_k.r}`, cyrillic: '-д, -нд', latin: '-d, -nd' })
      conversions.splice(0, 0, {
        traditional: `${_k.t}${isErUg ? _k.ou : _k.u}`,
        cyrillic: '-д, -нд',
        latin: '-d, -nd',
      })
    } else if (isVovel && isPossiblyHamaatuulah) {
      conversions.splice(0, 0, {
        traditional: isErUg ? `${_k.b}${_k.a}${_k.n}` : `${_k.b}${_k.e}${_k.n}`,
        cyrillic: '-аа(н), -ээ(н), -оо(н) -өө(н)',
        latin: '-aa(n), -ee(n), -oo(n), -uu(n)',
      })
    } else if (isConsonant && isPossiblyHamaatuulah) {
      conversions.splice(0, 0, {
        traditional: isErUg
          ? `${_k.connectorWithNoEmptySpace}${_k.i}${_k.i}${_k.a}${_k.n}`
          : `${_k.connectorWithNoEmptySpace}${_k.i}${_k.i}${_k.e}${_k.n}`,
        cyrillic: '-аа(н), -ээ(н), -оо(н) -өө(н)',
        latin: '-aa(n), -ee(n), -oo(n), -uu(n)',
      })
    } else if (precedingChar && isPossiblyChigleh) {
      conversions.splice(0, 0, {
        traditional: `${_k.ou}${_k.r}${_k.ou}${_k.g}${_k.ou}`,
        cyrillic: '-руу, -луу, -рүү, -лүү',
        latin: '-ruu, -luu',
      })
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
