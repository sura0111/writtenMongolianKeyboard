import fs from 'fs'
import path from 'path'
import dictionary from '@/database/dictionary.json'
import getLatins from '@/database/updater/getLatins'
import getTraditionals from '@/database/updater/getTraditionals'
import getWordsFromIkonRss from '@/database/updater/getWordsFromIkonRss'

const data: {
  [name: string]:
    | {
        cyrillic: string
        traditional: string
        latin: string
      }
    | undefined
} = Object.fromEntries(
  (dictionary as { cyrillic: string; traditional: string; latin: string }[]).map((item) => {
    return [item.cyrillic, item]
  }),
)

const update = async (cyrillicWords: string[]) => {
  const latins = getLatins(cyrillicWords)
  const traditionals = await getTraditionals(cyrillicWords)
  cyrillicWords.forEach((cyrillic, i) => {
    if (data[cyrillic] !== undefined || traditionals[i].includes(' ')) {
      return
    }
    data[cyrillic] = {
      cyrillic,
      latin: latins[i],
      traditional: traditionals[i],
    }
    console.log(cyrillic)
  })
  fs.writeFileSync(path.join(__dirname, '../dictionary.json'), JSON.stringify(Object.values(data)))
  // fs.writeFileSync(
  //   path.join(__dirname, '../dictionary.json'),
  //   JSON.stringify(
  //     dictionary.filter((item) => {
  //       return !item.traditional.includes(' ')
  //     }),
  //   ),
  // )
}

const main = async () => {
  const words = await getWordsFromIkonRss()
  update(words)
}

main()
