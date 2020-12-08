export { default as KEY_MAP } from './keyMap'
export { default as WRITTEN_TO_ALPHABET } from './writtenToAlphabetMap'
import Dictionary from './dictionary.json'
import { DictionaryList } from '../definitions'

export const DICTIONARY = (Dictionary as { dict: DictionaryList }).dict

export enum WRITTEN_MONGOL_KEY {
  a = 'ᠠ',
  b = 'ᠪ',
  ch = 'ᠴ',
  d = 'ᠳ',
  e = 'ᠡ',
  f = 'ᠹ',
  g = 'ᠭ',
  h = 'ᠬ',
  i = 'ᠢ',
  j = 'ᠵ',
  k = 'ᠺ',
  l = 'ᠯ',
  m = 'ᠮ',
  n = 'ᠨ',
  o = 'ᠣ',
  p = 'ᠫ',
  r = 'ᠷ',
  s = 'ᠰ',
  t = 'ᠲ',
  u = 'ᠥ',
  v = 'ᠸ',
  w = '᠊',
  sh = 'ᠱ',
  y = 'ᠶ',
  z = 'ᠽ',
  connector = '᠊',
  ts = 'ᠼ',
  lh = 'ᡀ',
  ng = 'ᠩ',
}

export const WRITTEN_MONGOL_TYPE = {
  vovels: ['ᠠ', 'ᠶ', 'ᠣ', 'ᠢ', 'ᠥ', 'ᠣ', 'ᠥ', 'ᠡ', '᠊ᠢ', 'ᡀ', 'ᠩ'] as (string | undefined | null)[],
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
