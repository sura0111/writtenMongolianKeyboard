import axios from 'axios'
import qs from 'querystring'
import { PARAMS, URL, PARSER } from './config'

const getTraditionals = async (input: string[]): Promise<string[]> => {
  try {
    const response = await axios.post(URL, qs.stringify(PARAMS(input)), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    return PARSER(response.data)
  } catch (error) {
    console.log(error)
    return []
  }
}

export default async (words: string[]): Promise<string[]> => {
  const newWords: string[] = []
  const crawl = async (start = 0, count = 500) => {
    const slicedWords = words.slice(start, start + count)
    if (slicedWords.length > 0) {
      const traditionalWords = await getTraditionals(slicedWords)
      newWords.push(...traditionalWords)
      await crawl(start + count, count)
    }
  }
  await crawl()
  return newWords
}
