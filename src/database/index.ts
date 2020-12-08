export { default as KEY_MAP } from '@/database/keyMap'
export { default as WRITTEN_TO_LATIN } from '@/database/writtenToLatin'
import key from '@/database/key'
import DICT from '@/database/dictionary.json'
import { DictionaryList } from '@/definitions'

export const KEY = key
export const DICTIONARY = DICT as DictionaryList

export const WRITTEN_MONGOL_TYPE = {
  vovels: [key.a, key.y, key.o, key.ou, key.i, key.u, key.uo, key.e] as (string | undefined | null)[],
  consonants: ['ᠪ', 'ᠸ', 'ᠭ', 'ᠳ', 'ᠵ', 'ᠺ', 'ᠯ', 'ᠮ', 'ᠨ', 'ᠫ', 'ᠷ', 'ᠰ', 'ᠲ', 'ᠹ', 'ᠬ', 'ᠴ', 'ᠱ', 'ᠽ', 'ᠼ', 'ᠩ'] as (
    | string
    | undefined
    | null
  )[],
  consonantWithoutN: ['ᠪ', 'ᠸ', 'ᠭ', 'ᠳ', 'ᠵ', 'ᠺ', 'ᠯ', 'ᠮ', 'ᠫ', 'ᠷ', 'ᠰ', 'ᠲ', 'ᠹ', 'ᠬ', 'ᠴ', 'ᠱ', 'ᠽ', 'ᠼ'] as (
    | string
    | undefined
    | null
  )[],
  consonantsHard: ['ᠪ', 'ᠭ', 'ᠵ', 'ᠳ', 'ᠺ', 'ᠫ', 'ᠷ', 'ᠰ', 'ᠲ', 'ᠹ', 'ᠬ', 'ᠴ', 'ᠱ', 'ᠽ', 'ᠼ'] as (
    | string
    | undefined
    | null
  )[],
  consonantsSoft: ['ᠸ', 'ᠯ', 'ᠮ', 'ᠨ', 'ᠩ'] as (string | undefined | null)[],
}
