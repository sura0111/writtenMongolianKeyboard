import cyrillicToLatin from './cyrillicToLatinMap'

export const getLatinWord = (cyrillic: string): string =>
  cyrillic
    .split('')
    .map((char, i) => {
      const current = cyrillicToLatin[char]
      if (i > 0) {
        const previous = cyrillicToLatin[cyrillic[i - 1]]
        if (
          (previous === 'ya' && current === 'a') ||
          (previous === 'yu' && current === 'u') ||
          (previous === 'ye' && current === 'e') ||
          (previous === 'yo' && current === 'o') ||
          (previous === 'yi' && current === 'i')
        ) {
          return ''
        }
      }
      return current
    })
    .join('')

export default (texts: string[]): string[] => texts.map((t) => getLatinWord(t))
