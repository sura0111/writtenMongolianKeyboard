const writtenToAlphabetMap: { [index: string]: { alphabet: string[]; cyrillic: string[] } } = {
  ᠠ: { alphabet: ['a'], cyrillic: ['а'] },
  ᠪ: { alphabet: ['b'], cyrillic: ['б'] },
  ᠴ: { alphabet: ['ch', 'ts'], cyrillic: ['ч', 'ц'] },
  ᠳ: { alphabet: ['d'], cyrillic: ['г', 'д'] },
  ᠡ: { alphabet: ['e'], cyrillic: ['э'] },
  ᠹ: { alphabet: ['f'], cyrillic: ['ф'] },
  ᠭ: { alphabet: ['g'], cyrillic: ['г'] },
  ᠬ: { alphabet: ['h', 'kh'], cyrillic: ['х'] },
  ᠢ: { alphabet: ['i'], cyrillic: ['и', 'й', 'ь', 'ъ', 'ий', 'ы'] },
  ᠵ: { alphabet: ['j', 'z'], cyrillic: ['ж', 'з'] },
  ᠺ: { alphabet: ['k'], cyrillic: ['к'] },
  ᠯ: { alphabet: ['l'], cyrillic: ['л'] },
  ᠮ: { alphabet: ['m'], cyrillic: ['м'] },
  ᠨ: { alphabet: ['n'], cyrillic: ['н'] },
  ᠣ: { alphabet: ['o', 'u'], cyrillic: ['о', 'у'] },
  ᠫ: { alphabet: ['p'], cyrillic: ['п'] },
  ᠷ: { alphabet: ['r'], cyrillic: ['р'] },
  ᠰ: { alphabet: ['s'], cyrillic: ['с'] },
  ᠲ: { alphabet: ['t'], cyrillic: ['т'] },
  ᠥ: { alphabet: ['u'], cyrillic: ['у', 'ү'] },
  ᠸ: { alphabet: ['v'], cyrillic: ['в'] },
  ᠱ: { alphabet: ['sh'], cyrillic: ['ш'] },
  ᠶ: { alphabet: ['y'], cyrillic: ['е', 'ю', 'я', 'ё'] },
  ᡀ: { alphabet: ['lh'], cyrillic: ['лх'] },
  ᠽ: { alphabet: ['z'], cyrillic: ['з'] },
  ᠩ: { alphabet: ['n'], cyrillic: ['н'] },
  ᠼ: { alphabet: ['ts'], cyrillic: ['ц'] },
  '᠊': { alphabet: [''], cyrillic: [''] },
}

export default writtenToAlphabetMap