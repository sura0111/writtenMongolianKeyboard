import axios from 'axios'
import cheerio from 'cheerio'

export default async (): Promise<string[]> => {
  const response = await axios.get('https://ikon.mn/rss')
  const $ = cheerio.load(response.data, { xmlMode: true })
  const descriptions: string[] = []

  $('channel')
    .find('item > description')
    .map((_, e) => {
      const data = $(e).text()
      const $2 = cheerio.load(`<div>${data}</div>`)
      descriptions.push(
        $2('div')
          .text()
          .replace(/[^\u0400-\u04FF]/g, ' ')
          .trim(),
      )
      return e
    })

  return ([] as string[]).concat(
    ...descriptions.map((item) => {
      return item
        .split(' ')
        .filter((a) => a)
        .map((a) => a.toLowerCase())
    }),
  )
}
